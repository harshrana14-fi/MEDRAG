import requests
import google.generativeai as genai
from config import config


class LLMService:
    def __init__(self):
        self.provider = config.LLM_PROVIDER
        if config.GEMINI_API_KEY:
            genai.configure(api_key=config.GEMINI_API_KEY)

    def _system_prompt(self) -> str:
        return """
You are a precise insurance policy document assistant.
You answer questions about ANY insurance policy document uploaded by the user.

STRICT RULES — NEVER VIOLATE:

1. ONLY use the context provided below. Never use outside knowledge. Never infer or assume anything.

2. Each context block has a SECTION label. Use ONLY the section relevant to the question:
   - Coverage/benefit questions → COVERAGE section
   - Exclusion questions → EXCLUSIONS section  
   - Claims questions → CLAIMS section
   - Definition questions → DEFINITIONS section
   - Never mix sections in one answer.

3. COVERAGE and EXCLUSIONS are OPPOSITES:
   - Never present an exclusion as a benefit.
   - Never present a benefit as an exclusion.

4. ABSOLUTE FORBIDDEN BEHAVIORS:
   - NEVER ask for patient age, policy start date, location, or any personal details.
   - NEVER say "to provide more specific information, please provide...".
   - NEVER ask follow-up questions.
   - NEVER request clarification about personal details.
   - If question can be answered from document → answer it.
   - If question cannot be answered → say only: "This information is not available in the provided policy document."
   - Do NOT ask anything. Just answer or say not available.

5. NEVER hallucinate:
   - Never invent patient age, policy duration, or any personal details.
   - Never carry context from previous questions.
   - Never assume what is not stated.


6. NEVER include in answers (unless explicitly asked):
   - Renewal or cancellation terms in benefit answers.
   - General conditions in exclusion answers.
   - Unrelated section content.

7. FORMAT rules:
   - List items as bullet points.
   - Be concise and direct.
   - Use the document's own terminology.
   - Do not paraphrase if exact wording matters.

8. If truly not found after checking all context:
   "This information is not available in the provided policy document."
   (Only say this if you have genuinely checked all provided context blocks.)

9. If context from multiple sections is provided, clearly label which section each point comes from.
"""




    def _build_prompt(self, query: str, context: str, questionnaire: dict | None = None) -> str:
        user_info = ""
        if questionnaire:
            policy_yrs = questionnaire.get('policyYears', 0)
            age = questionnaire.get('age', 0)
            user_info = f"""
            PATIENT INFORMATION:
            - Policy Start: {policy_yrs if policy_yrs > 0 else 'Not provided'}
            - Patient Age: {age if age > 0 else 'Not provided'}

            - Claim Type: {questionnaire.get('claimType', 'Not specified')}
            - Diagnosis/Treatment: {questionnaire.get('diseaseName', 'Not specified')}
            - Location: {questionnaire.get('location', 'Not specified')}
            - Previous Claims: {"Yes" if questionnaire.get('previousClaims') else "No"}
            """

        return f"""CONTEXT FROM PATIENT DOCUMENTS:
{context}

{user_info}
────────────────────────────────────────────────

PATIENT QUESTION: {query}

ANSWER (cite the source document, be specific about costs and services based on patient age and policy duration if relevant):"""

    def call_groq(self, prompt: str) -> str:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {config.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": config.GROQ_MODEL,
            "messages": [
                {"role": "system", "content": self._system_prompt()},
                {"role": "user",   "content": prompt}
            ],
            "temperature": 0.1,   # lower = more factual, less creative
            "max_tokens": 1024,
            "top_p": 0.9,
        }
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            if response.status_code != 200:
                print(f"GROQ ERROR: {response.status_code} - {response.text}")
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Exception in call_groq: {str(e)}")
            raise

    def call_gemini(self, prompt: str) -> str:
        model = genai.GenerativeModel(
            model_name=config.GEMINI_MODEL,
            system_instruction=self._system_prompt()
        )
        response = model.generate_content(prompt)
        return response.text

    def call_ollama(self, prompt: str) -> str:
        url = f"{config.OLLAMA_BASE_URL}/api/generate"
        payload = {
            "model": config.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "system": self._system_prompt(),
            "options": {
                "temperature": 0.1,
                "num_predict": 1024,
            }
        }
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        return response.json()["response"]

    def generate_answer(self, query: str, context: str, questionnaire: dict | None = None) -> str:
        prompt = self._build_prompt(query, context, questionnaire)

        try:
            # 1. Try specified provider
            if self.provider == "gemini" and config.GEMINI_API_KEY:
                return self.call_gemini(prompt)
            elif self.provider == "groq" and config.GROQ_API_KEY:
                return self.call_groq(prompt)
            elif self.provider == "ollama":
                return self.call_ollama(prompt)
            
            # 2. Smart auto-selection if provider not set or invalid
            if config.GEMINI_API_KEY:
                return self.call_gemini(prompt)
            elif config.GROQ_API_KEY:
                return self.call_groq(prompt)
            else:
                return "LLM provider and API keys not configured correctly. Set LLM_PROVIDER=gemini/groq or set your API keys."
        except Exception as e:
            print(f"Error generating answer with {self.provider}: {str(e)}")
            # Fallback to alternative provider if one fails
            if self.provider != "gemini" and config.GEMINI_API_KEY:
                try:
                    print("Attempting fallback to Gemini...")
                    return self.call_gemini(prompt)
                except Exception: pass
            raise

    def expand_query(self, query: str) -> list[str]:
        """Expands the user query into 4-6 semantic variants for better retrieval."""
        expansion_prompt = f"""
        Expand the following insurance-related search query into 4-6 semantic variants.
        Focus on medical terms, procedure synonyms, and insurance terminology.
        Return ONLY a comma-separated list of variants.
        
        Example: "hair transplant" -> hair transplantation, hair restoration, cosmetic hair procedure, alopecia treatment, hair loss treatment
        
        Query: {query}
        Variants:"""
        
        try:
            # Use a faster/cheaper call if available, but for now use the same logic
            raw_variants = ""
            if self.provider == "gemini" and config.GEMINI_API_KEY:
                # Direct call without system prompt for speed/simplicity if possible, 
                # but let's stick to the existing methods for consistency
                model = genai.GenerativeModel(model_name=config.GEMINI_MODEL)
                response = model.generate_content(expansion_prompt)
                raw_variants = response.text
            elif self.provider == "groq" and config.GROQ_API_KEY:
                raw_variants = self.call_groq(expansion_prompt)
            else:
                raw_variants = self.call_ollama(expansion_prompt)
            
            variants = [v.strip() for v in raw_variants.split(',') if v.strip()]
            # Ensure the original query is included
            if query not in variants:
                variants.insert(0, query)
            return variants[:7] # Limit to 6-7 variants
        except Exception as e:
            print(f"Error expanding query: {str(e)}")
            return [query]


llm_service = LLMService()
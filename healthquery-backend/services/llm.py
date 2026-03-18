import requests
from config import config

class LLMService:
    def __init__(self):
        self.provider = config.LLM_PROVIDER

    def call_groq(self, prompt: str):
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {config.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": config.GROQ_MODEL,
            "messages": [
                {"role": "system", "content": "You are MEDOC, a specialized medical AI assistant. Your goal is to explain complex medical documents in simple, easy-to-understand terms for patients. Always base your answers ONLY on the provided context. If the answer isn't in the context, politely say you don't know based on the provided records."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }
        try:
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code != 200:
                print(f"GROQ ERROR: {response.status_code} - {response.text}")
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Exception in call_groq: {str(e)}")
            raise

    def call_ollama(self, prompt: str):
        url = f"{config.OLLAMA_BASE_URL}/api/generate"
        payload = {
            "model": config.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "system": "You are MEDOC, a specialized medical AI assistant. Your goal is to explain complex medical documents in simple, easy-to-understand terms for patients. Always base your answers ONLY on the provided context."
        }
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()["response"]

    def generate_answer(self, query: str, context: str):
        prompt = f"""
        CONTEXT FROM MEDICAL RECORDS:
        {context}

        USER QUESTION:
        {query}

        ANSWER (Simple, professional, and patient-focused):
        """
        
        if self.provider == "groq":
            return self.call_groq(prompt)
        elif self.provider == "ollama":
            return self.call_ollama(prompt)
        else:
            return "LLM Provider not configured correctly."

llm_service = LLMService()

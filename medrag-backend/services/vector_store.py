import chromadb
from chromadb.config import Settings
from config import config
import uuid

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
        self.collection = self.client.get_or_create_collection(name=config.CHROMA_COLLECTION)

    def add_documents(self, chunks: list, embeddings: list, metadatas: list):
        ids = [str(uuid.uuid4()) for _ in chunks]
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas
        )

    def detect_section_intent(self, query: str) -> list[str]:
        """Universal intent detection for any policy query"""
        UNIVERSAL_INTENT_MAP = {
            "COVERAGE": ["benefit", "benefits", "covered", "coverage", "what is covered", "reimbursable", "charges", "what does policy cover", "in-patient", "inpatient", "scope of cover", "what will be paid", "eligible", "payable", "indemnify", "what is included"],
            "EXCLUSIONS": ["exclusion", "excluded", "not covered", "not payable", "what is not", "permanent exclusion", "waiting period", "pre-existing", "ped", "what won't be covered", "not reimbursed", "not eligible", "refused", "rejected", "denied"],
            "CLAIMS": ["claim", "cashless", "reimbursement", "how to claim", "claim process", "documents required", "submit claim", "prior authorization", "network hospital", "discharge", "claim form", "how does cashless", "cashless work", "intimation", "notification of claim", "tpa"],
            "WAITING_PERIOD": ["waiting period", "wait", "pre-existing", "ped", "how long", "when will it be covered", "36 month", "24 month", "30 day", "first year", "cooling period"],
            "GENERAL": ["grace period", "renewal", "cancel", "cancellation", "portability", "migration", "nomination", "premium", "instalment", "policy renewal", "renew", "withdraw", "moratorium", "fraud", "free look", "notice", "grievance", "ombudsman", "dispute", "arbitration"],
            "DEFINITIONS": ["what is", "define", "meaning", "definition", "what does", "what are the terms", "what is meant", "what do you mean", "explain", "describe"],
            "SCHEDULE": ["sum insured", "premium amount", "policy number", "policy period", "start date", "end date", "insured name", "deductible", "co-payment", "copay"],
            "Key Features": ["key feature", "key features", "features", "highlights", "what makes", "unique features", "special features", "main features", "about policy", "tell me about", "overview", "summary"],
            "Policy Details": ["entry age", "age limit", "who can buy", "sum insured", "coverage amount", "tenure", "policy term", "instalment", "how to pay", "co-payment", "copay", "zone", "premium"],
            "Coverages": ["benefit", "covered", "coverage", "what is covered", "reimbursable", "inpatient", "daycare", "ambulance", "domiciliary", "organ donor", "newborn", "maternity", "restoration", "recharge", "loyalty", "wellness", "modern treatment", "ayush", "tele", "checkup"]
        }
        query_lower = query.lower()
        matched = []
        for section, keywords in UNIVERSAL_INTENT_MAP.items():
            if any(kw in query_lower for kw in keywords):
                matched.append(section)
        
        return matched if matched else list(UNIVERSAL_INTENT_MAP.keys())

    def query(self, query_embedding: list, query_text: str = "", top_k: int = 10, filename: str = None, allowed_sections: list | None = None):
        """Retrieve with 3-level fallback strategy and special overview handling."""
        
        # Special handling: if query is about features/overview/summary — search the ENTIRE document with higher top_k
        overview_keywords = ["key feature", "features", "overview", "about", "summary", "highlights", "tell me"]
        if query_text and any(kw in query_text.lower() for kw in overview_keywords):
            print("[OVERVIEW QUERY] Fetching broad context (top_k=8)")
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=8,
                where={"filename": filename} if filename else None
            )
            return results

        # LEVEL 1: Filtered search by detected section
        where_filter = {}
        if filename and allowed_sections:
            where_filter = {"$and": [{"filename": filename}, {"section": {"$in": allowed_sections}}]}
        elif filename:
            where_filter = {"filename": filename}
        elif allowed_sections:
            where_filter = {"section": {"$in": allowed_sections}}

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter if where_filter else None
        )

        # LEVEL 2: If < 2 results and we HAD a section filter, try semantic search only (filename only)
        if len(results['documents'][0]) < 2 and allowed_sections:
            print("[FALLBACK L2] Trying semantic-only search (ignoring sections)")
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where={"filename": filename} if filename else None
            )

        # LEVEL 3: If still empty, get top chunks from any policy (last resort)
        if len(results['documents'][0]) == 0:
            print("[FALLBACK L3] Getting top chunks from any doc")
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where={"document_type": "insurance_policy"}
            )
            
        return results




    def get_all_documents(self):
        # Retrieve all unique documents based on metadata filenames
        results = self.collection.get()
        if not results or 'ids' not in results or not results['ids']:
            return []
            
        unique_docs = {}
        for i in range(len(results['ids'])):
            metadatas = results.get('metadatas')
            if not metadatas or i >= len(metadatas) or not metadatas[i]:
                continue
                
            meta = metadatas[i]
            filename = meta.get('filename')
            if not filename:
                continue
                
            unique_docs[filename] = {
                "id": results['ids'][i],
                "filename": filename,
                "upload_date": meta.get('upload_date', 'Unknown'),
                "category": meta.get('category', 'Others'),
                "company": meta.get('company', 'Others')
            }
        return list(unique_docs.values())

    def delete_document(self, filename: str):
        self.collection.delete(where={"filename": filename})

vector_store = VectorStore()

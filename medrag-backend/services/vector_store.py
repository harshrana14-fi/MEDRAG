import chromadb
import os
import uuid
import datetime
from config import config

class VectorStore:
    def __init__(self):
        try:
            # Ensure directory exists (VERY IMPORTANT for Render)
            os.makedirs(config.CHROMA_PERSIST_DIR, exist_ok=True)

            self.client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
            self.collection = self.client.get_or_create_collection(name=config.CHROMA_COLLECTION)
            print("ChromaDB initialized successfully")
        except Exception as e:
            print("ERROR initializing vector store:", str(e))
            self.collection = None

    def add_documents(self, chunks: list, embeddings: list, metadatas: list):
        if not self.collection:
            print("Collection not initialized")
            return
        try:
            ids = [str(uuid.uuid4()) for _ in chunks]
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=chunks,
                metadatas=metadatas
            )
        except Exception as e:
            print("Error adding documents:", str(e))

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

    def query(self, query_embedding: list, query_text: str = "", top_k: int = 10, filename: str = None, allowed_sections: list | None = None, user_id: str = None):
        """Retrieve with 3-level fallback strategy and special overview handling."""
        if not self.collection:
            return {}

        try:
            # Special handling for overview queries
            overview_keywords = ["key feature", "features", "overview", "about", "summary", "highlights", "tell me"]
            if query_text and any(kw in query_text.lower() for kw in overview_keywords):
                where_filter = {"filename": filename} if filename else None
                # Add user_id filter if provided
                if user_id:
                    if where_filter:
                        where_filter = {"$and": [where_filter, {"$or": [{"user_id": user_id}, {"user_id": "public"}]}]}
                    else:
                        where_filter = {"$or": [{"user_id": user_id}, {"user_id": "public"}]}

                return self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=8,
                    where=where_filter
                )

            # LEVEL 1: Filtered search
            filters = []
            if filename:
                filters.append({"filename": filename})
            if allowed_sections:
                filters.append({"section": {"$in": allowed_sections}})
            if user_id:
                filters.append({"$or": [{"user_id": user_id}, {"user_id": "public"}]})

            where_filter = None
            if len(filters) > 1:
                where_filter = {"$and": filters}
            elif len(filters) == 1:
                where_filter = filters[0]

            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=where_filter
            )

            # LEVEL 2: Fallback if empty and had section filter
            if (not results['documents'] or not results['documents'][0]) and allowed_sections:
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k,
                    where={"filename": filename} if filename else None
                )

            # LEVEL 3: Final fallback
            if not results['documents'] or not results['documents'][0]:
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k,
                    where={"document_type": "insurance_policy"}
                )
            
            return results
        except Exception as e:
            print("Query error:", str(e))
            return {}

    def get_all_documents(self, user_id: str = None):
        if not self.collection:
            return []
        try:
            # Filter by user_id or public documents
            if user_id:
                # Show user's docs + public docs
                where_filter = {"$or": [{"user_id": user_id}, {"user_id": "public"}]}
            else:
                # Show ONLY public docs
                where_filter = {"user_id": "public"}
            
            results = self.collection.get(where=where_filter)
            if not results or not results.get("ids"):
                return []
            
            metadatas = results.get("metadatas", [])
            unique_docs = {}
            for i, meta in enumerate(metadatas):
                if not meta: continue
                filename = meta.get("filename")
                if not filename: continue
                unique_docs[filename] = {
                    "id": results["ids"][i],
                    "filename": filename,
                    "upload_date": meta.get("upload_date", "Unknown"),
                    "category": meta.get("category", "Others"),
                    "company": meta.get("company", "Others"),
                }
            return list(unique_docs.values())
        except Exception as e:
            print("Error fetching documents:", str(e))
            return []

    def delete_document(self, filename: str, user_id: str = None):
        if not self.collection:
            return
        try:
            where_filter = {"filename": filename}
            if user_id:
                where_filter = {"$and": [{"filename": filename}, {"user_id": user_id}]}
            
            self.collection.delete(where=where_filter)
        except Exception as e:
            print("Delete error:", str(e))

    def diagnose_missing_answer(self, term: str, filename: str = None):
        """Diagnostic function for retrieval issues"""
        from services.embedder import embedder
        try:
            query_embedding = embedder.embed_query(term)
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=20,
                where={"filename": filename} if filename else None
            )
            found_in_retrieval = False
            term_lower = term.lower()
            for i, doc in enumerate(results.get('documents', [[]])[0]):
                if term_lower in doc.lower():
                    found_in_retrieval = True
                    break
            if found_in_retrieval:
                print(f"RESULT: Term '{term}' found in top 20 retrieval.")
            else:
                print(f"RESULT: Term '{term}' NOT found in top 20 retrieval.")
        except Exception as e:
            print(f"Diagnostic failed: {e}")

# Global instance
vector_store = VectorStore()

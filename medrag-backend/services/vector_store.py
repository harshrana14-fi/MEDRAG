from pinecone import Pinecone
import uuid
import datetime
from config import config

class VectorStore:
    def __init__(self):
        try:
            if not config.PINECONE_API_KEY:
                print("WARNING: PINECONE_API_KEY not set. Vector operations will fail.")
                self.index = None
                return
            
            # Initialize Pinecone client
            self.client = Pinecone(api_key=config.PINECONE_API_KEY)
            self.index = self.client.Index(config.PINECONE_INDEX_NAME)
            print(f"Pinecone initialized successfully with index: {config.PINECONE_INDEX_NAME}")
        except Exception as e:
            print(f"ERROR initializing Pinecone: {str(e)}")
            self.index = None

    def add_documents(self, chunks: list, embeddings: list, metadatas: list):
        """Add documents and their embeddings to Pinecone"""
        if not self.index:
            print("Pinecone index not initialized")
            return
        try:
            vectors_to_upsert = []
            for chunk, embedding, metadata in zip(chunks, embeddings, metadatas):
                doc_id = str(uuid.uuid4())
                # Prepare metadata - Pinecone requires serializable metadata
                meta_dict = {
                    "text": chunk[:1000],  # Store preview (limited size)
                    **{k: str(v) for k, v in metadata.items()}  # Convert all values to strings
                }
                
                vectors_to_upsert.append({
                    "id": doc_id,
                    "values": embedding,
                    "metadata": meta_dict
                })
            
            # Upsert in batches (Pinecone has limits on batch size)
            batch_size = 100
            for i in range(0, len(vectors_to_upsert), batch_size):
                batch = vectors_to_upsert[i:i + batch_size]
                self.index.upsert(vectors=batch)
            
            print(f"Successfully added {len(vectors_to_upsert)} documents to Pinecone")
        except Exception as e:
            print(f"Error adding documents to Pinecone: {str(e)}")

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
        """Retrieve documents from Pinecone with filtering"""
        if not self.index:
            print("Pinecone index not initialized")
            return {"documents": [[]], "ids": [], "metadatas": [[]]}

        try:
            # Build filter conditions
            filter_conditions = {}
            
            if filename:
                filter_conditions["filename"] = {"$eq": filename}
            
            if user_id:
                # Match either user's documents or public documents
                filter_conditions["$or"] = [
                    {"user_id": {"$eq": user_id}},
                    {"user_id": {"$eq": "public"}}
                ]
            
            # Determine number of results (higher for section filtering)
            num_results = 8 if any(kw in query_text.lower() for kw in ["key feature", "features", "overview", "about", "summary", "highlights", "tell me"]) else top_k
            
            # Query Pinecone
            results = self.index.query(
                vector=query_embedding,
                top_k=num_results,
                filter=filter_conditions if filter_conditions else None,
                include_metadata=True
            )
            
            # Format response to match ChromaDB format
            documents = []
            ids = []
            metadatas = []
            
            for match in results.get("matches", []):
                doc_id = match["id"]
                metadata = match.get("metadata", {}).copy()
                text = metadata.pop("text", "")  # Extract stored text
                
                documents.append(text)
                ids.append(doc_id)
                metadatas.append(metadata)
            
            return {
                "documents": [documents] if documents else [[]],
                "ids": ids,
                "metadatas": [metadatas] if metadatas else [[]]
            }
            
        except Exception as e:
            print(f"Query error: {str(e)}")
            return {"documents": [[]], "ids": [], "metadatas": [[]]}

    def get_all_documents(self, user_id: str = None):
        """Get all unique documents by filename"""
        if not self.index:
            return []
        try:
            # Build filter
            filter_conditions = None
            if user_id:
                filter_conditions = {
                    "$or": [
                        {"user_id": {"$eq": user_id}},
                        {"user_id": {"$eq": "public"}}
                    ]
                }
            else:
                filter_conditions = {"user_id": {"$eq": "public"}}
            
            # Query for all vectors matching filter
            results = self.index.query(
                vector=[0.0] * 384,  # Dummy vector for list operation (sentence-transformers produces 384-dim vectors)
                top_k=10000,  # Get many results
                filter=filter_conditions,
                include_metadata=True
            )
            
            unique_docs = {}
            for match in results.get("matches", []):
                metadata = match.get("metadata", {})
                filename = metadata.get("filename")
                
                if filename and filename not in unique_docs:
                    unique_docs[filename] = {
                        "id": match["id"],
                        "filename": filename,
                        "upload_date": metadata.get("upload_date", "Unknown"),
                        "category": metadata.get("category", "Others"),
                        "company": metadata.get("company", "Others"),
                    }
            
            return list(unique_docs.values())
        except Exception as e:
            print(f"Error fetching documents: {str(e)}")
            return []

    def delete_document(self, filename: str, user_id: str = None):
        """Delete all vectors associated with a filename"""
        if not self.index:
            return
        try:
            # Build filter to find vectors with this filename
            filter_conditions = {"filename": {"$eq": filename}}
            if user_id:
                filter_conditions["user_id"] = {"$eq": user_id}
            
            # Query to find vectors matching the filter
            results = self.index.query(
                vector=[0.0] * 384,  # Dummy vector for list operation
                top_k=10000,
                filter=filter_conditions,
                include_metadata=True
            )
            
            # Delete in batches
            vector_ids = [match["id"] for match in results.get("matches", [])]
            batch_size = 100
            for i in range(0, len(vector_ids), batch_size):
                batch = vector_ids[i:i + batch_size]
                self.index.delete(ids=batch)
            
            print(f"Deleted {len(vector_ids)} vectors for {filename}")
        except Exception as e:
            print(f"Delete error: {str(e)}")

    def diagnose_missing_answer(self, term: str, filename: str = None):
        """Diagnostic function for retrieval issues"""
        from services.embedder import embedder
        try:
            query_embedding = embedder.embed_query(term)
            
            # Build filter
            filter_conditions = None
            if filename:
                filter_conditions = {"filename": {"$eq": filename}}
            
            results = self.index.query(
                vector=query_embedding,
                top_k=20,
                filter=filter_conditions,
                include_metadata=True
            )
            
            found_in_retrieval = False
            term_lower = term.lower()
            
            for match in results.get("matches", []):
                metadata = match.get("metadata", {})
                text = metadata.get("text", "")
                if term_lower in text.lower():
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

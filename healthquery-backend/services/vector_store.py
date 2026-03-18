import chromadb
from chromadb.config import Settings
from config import config
import uuid

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
        self.collection = self.client.get_or_create_collection(name=config.CHROMA_COLLECTION)

    def add_documents(self, chunks: list, embeddings: list, metadata: dict):
        ids = [str(uuid.uuid4()) for _ in chunks]
        metadatas = [metadata for _ in chunks]
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas
        )

    def query(self, query_embedding: list, top_k: int = config.TOP_K_RESULTS):
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
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
                "upload_date": meta.get('upload_date', 'Unknown')
            }
        return list(unique_docs.values())

    def delete_document(self, filename: str):
        self.collection.delete(where={"filename": filename})

vector_store = VectorStore()

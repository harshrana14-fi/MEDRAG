from services.vector_store import vector_store
import json

def check_db():
    results = vector_store.collection.get()
    print(f"Total IDs: {len(results['ids'])}")
    if results['metadatas']:
        print(f"Sample Metadata: {results['metadatas'][0]}")
    
    docs = vector_store.get_all_documents()
    print(f"All Unique Documents: {json.dumps(docs, indent=2)}")

if __name__ == "__main__":
    check_db()

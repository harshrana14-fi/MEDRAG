import chromadb
from config import config

def fix_chroma_public_docs():
    print("Fixing ChromaDB public documents...")
    client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
    collection = client.get_or_create_collection(name=config.CHROMA_COLLECTION)
    
    # Get all documents
    results = collection.get()
    ids = results.get("ids", [])
    metadatas = results.get("metadatas", [])
    
    updated_ids = []
    updated_metadatas = []
    
    for i, meta in enumerate(metadatas):
        if not meta or "user_id" not in meta:
            new_meta = meta.copy() if meta else {}
            new_meta["user_id"] = "public"
            updated_ids.append(ids[i])
            updated_metadatas.append(new_meta)
    
    if updated_ids:
        print(f"Updating {len(updated_ids)} documents with user_id: 'public'...")
        collection.update(
            ids=updated_ids,
            metadatas=updated_metadatas
        )
        print("Done!")
    else:
        print("No documents need updating.")

if __name__ == "__main__":
    fix_chroma_public_docs()

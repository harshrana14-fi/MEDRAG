from services.pdf_parser import extract_text_from_pdf
from services.chunker import chunk_sections
from services.vector_store import vector_store
from services.embedder import embedder
import os

def reindex_one(pdf_name):
    path = os.path.join("policies", pdf_name)
    print(f"Index {path}...")
    
    # 0. Delete
    vector_store.delete_document(pdf_name)
    
    # 1. Parse
    sections = extract_text_from_pdf(path)
    print(f"Sections: {len(sections)}")
    
    # 2. Chunk
    chunks = chunk_sections(sections, pdf_name)
    print(f"Chunks: {len(chunks)}")
    
    if len(chunks) == 0:
        print("Empty chunks! Skip.")
        return
        
    # 3. Embed
    texts = [c["text"] for c in chunks]
    metas = [c["metadata"] for c in chunks]
    embeddings = embedder.embed_texts(texts)
    
    # 4. Add
    vector_store.add_documents(texts, embeddings, metas)
    print(f"Added {pdf_name} successfully.")

if __name__ == "__main__":
    reindex_one("BlueCross_HealthPolicy_2024.pdf")

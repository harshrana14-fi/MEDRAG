from services.pdf_parser import extract_text_from_pdf
from services.chunker import chunk_sections
from services.vector_store import vector_store
from services.embedder import embedder
import os

def reindex_all():
    policies_dir = "policies"
    if not os.path.exists(policies_dir):
        print(f"{policies_dir} not found.")
        return
        
    for file in os.listdir(policies_dir):
        if not file.endswith(".pdf"):
            continue
            
        path = os.path.join(policies_dir, file)
        print(f"\n--- Re-indexing {file} ---")
        
        try:
            # 0. Delete
            vector_store.delete_document(file)
            
            # 1. Parse
            sections = extract_text_from_pdf(path)
            print(f"Detected {len(sections)} sections: {[s['section'] for s in sections]}")
            
            # 2. Chunk
            chunks = chunk_sections(sections, file)
            print(f"Generated {len(chunks)} chunks.")
            
            if len(chunks) == 0:
                print("Skipping (0 chunks).")
                continue
                
            # 3. Embed
            texts = [c["text"] for c in chunks]
            metas = [c["metadata"] for c in chunks]
            embeddings = embedder.embed_texts(texts)
            
            # 4. Add Heuristics
            fn_lower = file.lower()
            company = file.split('_')[0] if "_" in file else file.split("-")[0]
            category = "Government Schemes" if ("bharat" in fn_lower or "ayushman" in fn_lower) else "Private Plans"
            upload_date = "2024-03-20 10:00:00"

            for m in metas:
                m["company"] = company
                m["category"] = category
                m["upload_date"] = upload_date

            vector_store.add_documents(texts, embeddings, metas)
            print(f"Done.")

        except Exception as e:
            print(f"Error indexing {file}: {str(e)}")

if __name__ == "__main__":
    reindex_all()

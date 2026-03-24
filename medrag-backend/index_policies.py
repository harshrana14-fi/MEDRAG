import sys
import os
import datetime

# Add the current directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.vector_store import vector_store
from services.embedder import embedder
from services.chunker import chunk_sections
from services.pdf_parser import extract_text_from_pdf

def get_mapping(filename: str):
    name = filename.lower()
    mapping = {
        "category": "Top Private Health Insurance Companies",
        "company": "Others"
    }

    # Companies
    if any(x in name for x in ["star_", "optima", "brochure_star", "women_care"]):
        mapping["company"] = "hdfc ergo"
    elif "hdfc" in name or "brochure" in name:
        mapping["company"] = "hdfc ergo"
    elif "icici" in name or "bluecross" in name:
        mapping["company"] = "icici"
    elif "ultimate" in name:
        mapping["company"] = "ultimate care"
    elif "adityabirla" in name or "birla" in name:
        mapping["company"] = "aditya birla"
    elif "niva" in name:
        mapping["company"] = "Niva Bupa"
    elif "ayushman" in name:
        mapping["company"] = "Ayushman Bharat Yojana"
        mapping["category"] = "Government Health Schemes"
    elif "govt" in name or "state_scheme" in name:
        mapping["company"] = "State Scheme"
        mapping["category"] = "Government Health Schemes"
    
    return mapping

def index_policies():
    policy_dir = "policies"
    if not os.path.exists(policy_dir):
        print("Policies directory not found.")
        return

    for filename in os.listdir(policy_dir):
        path = os.path.join(policy_dir, filename)
        if filename.endswith(".txt") or filename.endswith(".pdf"):
            print(f"Indexing {filename}...")
            
            # Delete if exists to avoid duplicates
            try:
                vector_store.delete_document(filename)
            except:
                pass
            
            if filename.endswith(".pdf"):
                sections = extract_text_from_pdf(path)
            else:
                with open(path, "r", encoding="utf-8") as f:
                    text = f.read()
                sections = [{"section": "GENERAL", "text": text}]
            
            if not sections:
                print(f"No sections extracted from {filename}, skipping.")
                continue

            chunks = chunk_sections(sections, filename)
            if not chunks:
                print(f"No chunks generated for {filename}, skipping.")
                continue

            texts = [c["text"] for c in chunks]
            metadatas = [c["metadata"] for c in chunks]
            
            # Add company and category to each chunk's metadata
            meta_map = get_mapping(filename)
            for m in metadatas:
                m["upload_date"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                m["category"] = meta_map["category"]
                m["company"] = meta_map["company"]

            embeddings = embedder.embed_texts(texts)
            vector_store.add_documents(texts, embeddings, metadatas)
            print(f"Index complete for {filename} (Category: {meta_map['category']}, Company: {meta_map['company']})")

if __name__ == "__main__":
    index_policies()

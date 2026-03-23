import sys
import os
import datetime

# Add the current directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.vector_store import vector_store
from services.embedder import embedder
from services.chunker import chunk_text

from services.vector_store import vector_store
from services.embedder import embedder
from services.chunker import chunk_text
from services.pdf_parser import extract_text_from_pdf

def get_mapping(filename: str):
    name = filename.lower()
    mapping = {
        "category": "Top Private Health Insurance Companies",
        "company": "Others"
    }

    # Companies
    if any(x in name for x in ["star_", "optima", "brochure_star", "women_care"]):
        mapping["company"] = "Star Plus"
    elif "hdfc" in name:
        mapping["company"] = "HDFC ERGO"
    elif "icici" in name:
        mapping["company"] = "ICICI Lombard"
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
            
            if filename.endswith(".pdf"):
                text = extract_text_from_pdf(path)
            else:
                with open(path, "r", encoding="utf-8") as f:
                    text = f.read()
            
            if not text.strip():
                print(f"Empty text in {filename}, skipping.")
                continue

            chunks = chunk_text(text)
            embeddings = embedder.embed_texts(chunks)
            meta_map = get_mapping(filename)
            metadata = {
                "filename": filename,
                "upload_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "category": meta_map["category"],
                "company": meta_map["company"]
            }
            vector_store.add_documents(chunks, embeddings, metadata)
            print(f"Index complete for {filename} (Category: {meta_map['category']}, Company: {meta_map['company']})")

if __name__ == "__main__":
    index_policies()

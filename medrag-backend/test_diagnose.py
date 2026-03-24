from services.vector_store import vector_store
from services.embedder import embedder

def diagnose():
    policy = "BlueCross_HealthPolicy_2024.pdf"
    term = "hair transplant"
    vector_store.diagnose_missing_answer(term, policy)
    
    # Also check what variants the LLM generates
    from services.llm import llm_service
    variants = llm_service.expand_query(term)
    print(f"Variants generated: {variants}")
    
    for v in variants:
        print(f"\nChecking variant: {v}")
        vector_store.diagnose_missing_answer(v, policy)

if __name__ == "__main__":
    diagnose()

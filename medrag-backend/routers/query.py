from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest, QueryResponse
from services.embedder import embedder
from services.vector_store import vector_store
from services.llm import llm_service

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # 1. QUERY EXPANSION: Generate 4-6 semantic variants
        # Example: "hair transplant" -> "hair restoration", "cosmetic procedure", etc.
        query_variants = llm_service.expand_query(request.query)
        print(f"QUERY: {request.query} | VARIANTS: {query_variants}")

        # 2. INTENT DETECTION: Broaden coverage detection to include procedures and synonyms
        allowed_sections = vector_store.detect_section_intent(request.query)
        coverage_keywords = ["cover", "benefit", "pay", "eligible", "reimburse", "transplant", "surgery", "treatment", "procedure"]
        is_coverage_query = "COVERAGE" in allowed_sections or any(kw in request.query.lower() for kw in coverage_keywords)
        
        all_documents = []
        all_metadatas = []
        seen_chunk_ids = set()

        def add_refined_results(res):
            if not res or not res.get('documents') or not res['documents'][0]:
                return
            docs = res['documents'][0]
            metas = res['metadatas'][0]
            ids = res['ids'][0]
            for d, m, chunk_id in zip(docs, metas, ids):
                if chunk_id not in seen_chunk_ids:
                    seen_chunk_ids.add(chunk_id)
                    all_documents.append(d)
                    all_metadatas.append(m)

        # 3. ROBUST RETRIEVAL: Loop through variants with multi-section fallback
        for variant in query_variants:
            if is_coverage_query:
                # DUAL+ SECTION RETRIEVAL: Target both Coverage and Exclusions specifically
                # Query 1: Focus on Coverage
                q1 = f"Is {variant} covered benefit payable?"
                emb1 = embedder.embed_query(q1)
                res1 = vector_store.query(emb1, query_text=q1, filename=request.selectedPolicy, allowed_sections=["COVERAGE"], top_k=10)
                add_refined_results(res1)
                
                # Query 2: Focus on Exclusions (CRITICAL for "not available" issues)
                q2 = f"Is {variant} excluded permanent exclusion not covered?"
                emb2 = embedder.embed_query(q2)
                res2 = vector_store.query(emb2, query_text=q2, filename=request.selectedPolicy, allowed_sections=["EXCLUSIONS"], top_k=15)
                add_refined_results(res2)

                # Query 3: Broad Semantic Search (Safety net for mis-tagged chunks)
                emb3 = embedder.embed_query(variant)
                res3 = vector_store.query(emb3, query_text=variant, filename=request.selectedPolicy, allowed_sections=None, top_k=10)
                add_refined_results(res3)
            else:
                # Normal retrieval for other intents
                emb = embedder.embed_query(variant)
                res = vector_store.query(emb, query_text=variant, filename=request.selectedPolicy, allowed_sections=allowed_sections)
                add_refined_results(res)

        if not all_documents:
            # Last resort diagnostic
            vector_store.diagnose_missing_answer(request.query, filename=request.selectedPolicy)
            return {
                "answer": "This information is not available in the provided policy document.",
                "sources": []
            }

        # 4. Merging and Ranking: Sort results so EXCLUSIONS appear prominently if query is coverage-based
        # This helps the LLM see the negative constraint immediately.
        final_results = list(zip(all_documents, all_metadatas))
        if is_coverage_query:
            # Prioritize EXCLUSIONS chunks in the context list for visibility
            final_results.sort(key=lambda x: x[1].get("section", "") == "EXCLUSIONS", reverse=True)

        # 5. Build Context: Increase limit to 25 chunks for better coverage
        formatted_context_list = []
        for doc_text, meta in final_results[:25]:
            section = meta.get("section", "General")
            formatted_context_list.append(f"\n\n[SECTION: {section}]\n{doc_text}")
        
        context = "".join(formatted_context_list)
        sources = list(set([m['filename'] for m in all_metadatas if m and 'filename' in m]))
        
        # 6. LLM Generation
        answer = llm_service.generate_answer(
            request.query, 
            context, 
            questionnaire=request.questionnaire.dict() if request.questionnaire else None
        )

        return {
            "answer": answer,
            "sources": sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

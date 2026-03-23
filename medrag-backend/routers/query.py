from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest, QueryResponse
from services.embedder import embedder
from services.vector_store import vector_store
from services.llm import llm_service

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # 1. Detect Section Intent
        allowed_sections = vector_store.detect_section_intent(request.query)
        print(f"QUERY: {request.query} | INTENT SECTIONS: {allowed_sections}")

        # 2. Embed query
        query_embedding = embedder.embed_query(request.query)
        
        # 3. RAG: Search Vector Store (with automatic 3-level fallback + special overview handling)
        results = vector_store.query(
            query_embedding, 
            query_text=request.query,
            filename=request.selectedPolicy,
            allowed_sections=allowed_sections
        )


        
        if not results or not results.get('documents') or not results['documents'][0]:
            return {
                "answer": "This information is not available in the provided policy document.",
                "sources": []
            }

        # 4. Format Context with Section Labels
        formatted_context_list = []
        metadatas = results.get('metadatas', [[]])[0]
        documents = results.get('documents', [[]])[0]
        
        for doc_text, meta in zip(documents, metadatas):
            section = meta.get("section", "General")
            formatted_context_list.append(f"\n\n[SECTION: {section}]\n{doc_text}")
        
        context = "".join(formatted_context_list)
        
        sources = []
        if metadatas:
            sources = list(set([m['filename'] for m in metadatas if m and 'filename' in m]))
        
        # 5. Generate Answer with LLM
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

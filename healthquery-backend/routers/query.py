from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest, QueryResponse
from services.embedder import embedder
from services.vector_store import vector_store
from services.llm import llm_service

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # 1. Embed query
        query_embedding = embedder.embed_query(request.query)
        
        # 2. RAG: Search Vector Store
        results = vector_store.query(query_embedding)
        
        if not results or not results.get('documents') or not results['documents'][0]:
            return {
                "answer": "I couldn't find any relevant information in your uploaded medical documents to answer that question.",
                "sources": []
            }

        context = "\n---\n".join(results['documents'][0])
        sources = []
        if results.get('metadatas') and results['metadatas'][0]:
            sources = list(set([m['filename'] for m in results['metadatas'][0] if m and 'filename' in m]))
        
        # 3. Generate Answer with LLM
        answer = llm_service.generate_answer(request.query, context)
        
        return {
            "answer": answer,
            "sources": sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

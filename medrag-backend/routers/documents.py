from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import DocumentInfo, Message
from services.vector_store import vector_store

router = APIRouter()

@router.get("/documents", response_model=List[DocumentInfo])
async def list_documents():
    try:
        docs = vector_store.get_all_documents()
        return docs if docs else []
    except Exception as e:
        print("❌ ERROR in /documents:", str(e))
        return []  # never crash

@router.delete("/documents/{filename}", response_model=Message)
async def delete_document(filename: str):
    try:
        vector_store.delete_document(filename)
        return {"message": f"Document {filename} deleted from index."}
    except Exception as e:
        print("❌ DELETE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

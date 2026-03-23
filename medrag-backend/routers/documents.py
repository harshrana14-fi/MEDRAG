from fastapi import APIRouter, HTTPException
from models.schemas import DocumentInfo, Message
from services.vector_store import vector_store
from typing import List

router = APIRouter()

@router.get("/documents", response_model=List[DocumentInfo])
async def list_documents():
    return vector_store.get_all_documents()

@router.delete("/documents/{filename}", response_model=Message)
async def delete_document(filename: str):
    try:
        vector_store.delete_document(filename)
        return {"message": f"Document {filename} deleted from index."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

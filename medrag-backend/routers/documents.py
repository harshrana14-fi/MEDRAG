from fastapi import APIRouter, HTTPException, Response, Depends
from typing import List
from models.schemas import DocumentInfo, Message, User
from services.vector_store import vector_store
from services.mongodb import mongodb_service
from services.auth import get_current_user, get_current_user_optional

router = APIRouter()

@router.get("/documents", response_model=List[DocumentInfo])
async def list_documents(current_user: User = Depends(get_current_user_optional)):
    try:
        user_id = current_user["email"] if current_user else None
        docs = vector_store.get_all_documents(user_id=user_id)
        return docs if docs else []
    except Exception as e:
        print("❌ ERROR in /documents:", str(e))
        return []  # never crash

@router.get("/policies/{filename}")
async def get_policy_pdf(filename: str):
    """Serve PDF from MongoDB GridFS"""
    content = await mongodb_service.get_file(filename)
    if not content:
        raise HTTPException(status_code=404, detail="Policy file not found in database")
    return Response(content=content, media_type="application/pdf")

@router.delete("/documents/{filename}", response_model=Message)
async def delete_document(filename: str, current_user: User = Depends(get_current_user)):
    try:
        user_id = current_user["email"]
        # 1. Delete from Vector Store (only if it belongs to this user)
        # Note: vector_store.delete_document might need update to support user_id
        vector_store.delete_document(filename, user_id=user_id)
        # 2. Delete from MongoDB GridFS
        await mongodb_service.delete_file(filename)
        
        return {"message": f"Document {filename} deleted from index and database."}
    except Exception as e:
        print("❌ DELETE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

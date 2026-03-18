from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_parser import extract_text_from_pdf
from services.chunker import chunk_text
from services.embedder import embedder
from services.vector_store import vector_store
from models.schemas import Message
import os
import shutil
import datetime

router = APIRouter()

@router.post("/upload", response_model=Message)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Save temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. Extract Text
        text = extract_text_from_pdf(temp_path)
        
        # 2. Chunk Text
        chunks = chunk_text(text)
        
        # 3. Embed Chunks
        embeddings = embedder.embed_texts(chunks)
        
        # 4. Save to Vector Store
        metadata = {
            "filename": file.filename,
            "upload_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        vector_store.add_documents(chunks, embeddings, metadata)

        return {"message": f"Successfully processed {file.filename}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

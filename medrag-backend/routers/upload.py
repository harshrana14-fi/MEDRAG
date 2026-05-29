from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.pdf_parser import extract_text_from_pdf
from services.chunker import chunk_sections
from services.embedder import embedder
from services.vector_store import vector_store
from services.auth import get_current_user
from models.schemas import Message, User
import os
import shutil
import datetime

router = APIRouter()

@router.post("/upload", response_model=Message)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Save temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 0. Clean old data for this file to avoid duplicates
        vector_store.delete_document(file.filename)

        # 1. Extract Sections (Returns list of dicts)
        sections = extract_text_from_pdf(temp_path)
        print(f"[UPLOAD] Detected sections: {[s['section'] for s in sections]}")
        
        # 2. Chunk Sections (Returns list of dicts with text and metadata)
        structured_chunks = chunk_sections(sections, file.filename)
        print(f"[UPLOAD] Total chunks created: {len(structured_chunks)}")
        
        chunks = [c["text"] for c in structured_chunks]
        metadatas = [c["metadata"] for c in structured_chunks]
        
        # 3. Embed Chunks
        embeddings = embedder.embed_texts(chunks)
        
        # 4. Save to Vector Store
        upload_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Simple heuristics for company and category
        fn_lower = file.filename.lower()
        company = file.filename.split('_')[0] if "_" in file.filename else file.filename.split("-")[0]
        category = "Government Schemes" if ("bharat" in fn_lower or "ayushman" in fn_lower) else "Private Plans"

        metadata = {
            "upload_date": upload_date,
            "company": company,
            "category": category,
            "filename": file.filename,
            "user_id": current_user["email"]
        }

        for m in metadatas:
            m.update(metadata)
            
        vector_store.add_documents(chunks, embeddings, metadatas)

        # 5. Upload original PDF to MongoDB GridFS
        from services.mongodb import mongodb_service
        with open(temp_path, "rb") as f:
            await mongodb_service.upload_file(f.read(), file.filename, metadata=metadata)

        return {"message": f"Successfully processed and stored {file.filename} in MongoDB"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

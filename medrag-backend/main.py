from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, query, documents
from config import config
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="MEDRAG HealthQuery AI Backend")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upload.router, tags=["Upload"])
app.include_router(query.router, tags=["Query"])
app.include_router(documents.router, tags=["Documents"])

# Serve static PDF policy documents
app.mount("/policies", StaticFiles(directory="policies"), name="policies")

@app.get("/")
async def root():
    return {"status": "MEDRAG Backend is Online", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

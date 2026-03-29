from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import upload, query, documents
import os

app = FastAPI(title="MEDRAG HealthQuery AI Backend")

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://medrag-frontend.onrender.com",
    "https://medrag-six.vercel.app/",  # your deployed frontend
]

# Optional: add from environment variable (safer)
frontend_env = os.getenv("FRONTEND_URL")
if frontend_env:
    origins.append(frontend_env)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include Routers
app.include_router(upload.router, tags=["Upload"])
app.include_router(query.router, tags=["Query"])
app.include_router(documents.router, tags=["Documents"])

# ✅ Serve static PDF policy documents
app.mount("/policies", StaticFiles(directory="policies"), name="policies")

# ✅ Health check route
@app.get("/")
async def root():
    return {
        "status": "MEDRAG Backend is Online",
        "version": "1.0.0"
    }

# ❌ REMOVE reload=True in production
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

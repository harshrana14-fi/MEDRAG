from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]

class DocumentInfo(BaseModel):
    id: str
    filename: str
    upload_date: str

class Message(BaseModel):
    message: str

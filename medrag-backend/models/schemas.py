from pydantic import BaseModel
from typing import List, Optional

class QuestionnaireRecord(BaseModel):
    policyYears: int
    age: int
    claimType: str
    diseaseName: Optional[str] = None
    location: Optional[str] = None
    previousClaims: Optional[bool] = False

class QueryRequest(BaseModel):
    query: str
    questionnaire: Optional[QuestionnaireRecord] = None
    selectedPolicy: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]

class DocumentInfo(BaseModel):
    id: str
    filename: str
    upload_date: str
    category: Optional[str] = "Others"
    company: Optional[str] = "Others"

class Message(BaseModel):
    message: str

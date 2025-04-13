from pydantic import BaseModel
from typing import List

# Base schema for Job Questions
class JobQuestionBase(BaseModel):
    question: str

# Schema for creating job questions
class JobQuestionCreate(JobQuestionBase):
    pass

# Schema for returning job questions
class JobQuestionResponse(JobQuestionBase):
    id: int
    job_id: int

    class Config:
        from_attributes = True  # ✅ Required for Pydantic v2

# Base schema for Job
class JobBase(BaseModel):
    title: str
    description: str
    salary: float
    company: str
    job_type: str
    skills: str
    requirements: str  

# Schema for creating a job (includes multiple questions)
class JobCreate(JobBase):
    HRId:int
    questions: List[JobQuestionCreate]

# Schema for job listing (Minimal details)
class JobListingResponse(BaseModel):
    id: int
    title: str
    company: str
    salary: float

    class Config:
        from_attributes = True

# Schema for viewing full job details (Includes multiple questions)
class JobDetailResponse(JobBase):
    id: int
    questions: List[JobQuestionResponse]  # ✅ Now supports multiple questions

    class Config:
        from_attributes = True

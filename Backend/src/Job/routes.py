from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db
from Job.schemas import JobCreate, JobDetailResponse, JobListingResponse
from Job.services import create_job, get_all_jobs, get_job_details , get_questions , fetch_questions
from typing import List
from pydantic import BaseModel

job_router = APIRouter()

# Wrapper response model for job listings
class JobListResponse(BaseModel):
    jobs: List[JobListingResponse]

@job_router.post("/create_job", response_model=JobDetailResponse)
async def create_new_job(job_data: JobCreate, db: AsyncSession = Depends(get_db)):
    # ✅ Create job first
    jobdeets = await create_job(db, job_data)

    # ✅ Insert questions and fetch them
    await get_questions(jobdeets.id, job_data.questions, db)
    inserted_questions = await fetch_questions(jobdeets.id, db)

    # ✅ Return job details including inserted questions
    return JobDetailResponse(
        id=jobdeets.id,
        title=jobdeets.title,
        description=jobdeets.description,
        salary=jobdeets.salary,
        company=jobdeets.company,
        job_type=jobdeets.job_type,
        skills=jobdeets.skills,
        requirements=jobdeets.requirements,
        questions=inserted_questions  # ✅ Updated response with questions
    )

# Display all jobs (Basic Details: title, company, salary)
@job_router.get("/get_jobs", response_model=JobListResponse)
async def get_jobs(db: AsyncSession = Depends(get_db)):
    jobs = await get_all_jobs(db)
    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found")
    return {"jobs": jobs}

# Get full job details when "View Details" is clicked
@job_router.get("/get_job_info", response_model=JobDetailResponse)
async def get_job_info(job_id: int, db: AsyncSession = Depends(get_db)):
    job_details = await get_job_details(db, job_id)
    if not job_details:
        raise HTTPException(status_code=404, detail="Job not found")
    return job_details

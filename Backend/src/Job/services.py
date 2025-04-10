from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from db.Models.JobModels import Job, JobQuestion 
from typing import List
from Job.schemas import (
    JobCreate,
    JobDetailResponse,
    JobListingResponse,
    JobQuestionResponse,
    JobQuestionCreate
)

async def create_job(db: AsyncSession, job_data: JobCreate) -> JobDetailResponse:
    """
    Create a new job entry.
    """
    new_job = Job(
        title=job_data.title,
        description=job_data.description,
        salary=job_data.salary,
        company=job_data.company,
        job_type=job_data.job_type,  
        skills=job_data.skills,  
        requirements=job_data.requirements,
    )
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)

    return JobDetailResponse(
        id=new_job.id,
        title=new_job.title,
        description=new_job.description,
        salary=new_job.salary,
        company=new_job.company,
        job_type=new_job.job_type,
        skills=new_job.skills,
        requirements=new_job.requirements,
        questions=[]  
    )

async def get_questions(job_id: int, questions: List[JobQuestionCreate], db: AsyncSession):
    """
    Insert questions into the database.
    """
    if questions:
        job_questions = [JobQuestion(job_id=job_id, question=q.question) for q in questions]
        db.add_all(job_questions)
        await db.commit()

async def fetch_questions(job_id: int, db: AsyncSession) -> List[JobQuestionResponse]:
    """
    Fetch inserted questions for a job.
    """
    result = await db.execute(
        select(JobQuestion).where(JobQuestion.job_id == job_id)
    )
    questions = result.scalars().all()
    return [JobQuestionResponse(id=q.id, job_id=q.job_id, question=q.question) for q in questions]





async def get_all_jobs(db: AsyncSession):
    """
    Retrieve all jobs.
    Shows only title, company, and salary.
    """
    result = await db.execute(select(Job))
    jobs = result.scalars().all()  

    return [
        JobListingResponse(id=job.id, title=job.title, company=job.company, salary=job.salary)
        for job in jobs
    ]


async def get_job_details(db: AsyncSession, job_id: int):
    """
    Retrieve full job details when clicking "View Details".
    """
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.questions))  
        .filter(Job.id == job_id)
    )
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobDetailResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        salary=job.salary,
        job_type=job.job_type,  
        description=job.description,
        skills=job.skills,  
        requirements=job.requirements,  
        questions=[
            JobQuestionResponse(id=q.id, job_id=q.job_id, question=q.question) 
            for q in job.questions  
        ]
    )

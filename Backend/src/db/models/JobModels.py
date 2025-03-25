from sqlalchemy import Column, ForeignKey, Integer, String, PrimaryKeyConstraint , Float
from sqlalchemy.orm import relationship
from src.db.database import Base  

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    salary = Column(Float, nullable=False)
    company = Column(String, nullable=False)
    job_type = Column(String, nullable=False)
    skills = Column(String, nullable=False)
    requirements = Column(String, nullable=False)

    
    questions = relationship("JobQuestion", back_populates="job", cascade="all, delete")


class JobQuestion(Base):
    __tablename__ = "job_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    
    job = relationship("Job", back_populates="questions")
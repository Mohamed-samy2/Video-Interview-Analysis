from sqlalchemy import Column, ForeignKey, Integer, String, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from src.db.database import Base  

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String)

    # CV_FilePath = Column(String)

    videos = relationship("UserVideo", back_populates="user")

class UserVideo(Base):
    __tablename__ = 'UserVideos'

    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    videoPath = Column(String, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('userId', 'videoPath'),
    )

    user = relationship("User", back_populates="videos")

class Job(Base):
    __tablename__ = 'jobs'  # Change to lowercase to match ForeignKey reference

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    questions = relationship("JobQuestion", back_populates="job")  # Fix back_populates reference


class JobQuestion(Base):
    __tablename__ = 'job_questions'  # Change to lowercase for consistency
    
    jobId = Column(Integer, ForeignKey('jobs.id'), nullable=False)  # Match table name case
    question = Column(String)

    __table_args__ = (
        PrimaryKeyConstraint('jobId', 'question'),
    )

    job = relationship("Job", back_populates="questions")  # Fix back_populates reference


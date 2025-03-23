from sqlalchemy import Column, ForeignKey, Integer, String, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from db.database import Base  

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

from sqlalchemy import Column, ForeignKey, Integer, String, PrimaryKeyConstraint, Text, Float
from sqlalchemy.orm import relationship
from src.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)

    videos = relationship("UserVideo", back_populates="user")


class UserVideo(Base):
    __tablename__ = "user_videos"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    video_path = Column(String, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint("user_id", "video_path"),
    )

    user = relationship("User", back_populates="videos")

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
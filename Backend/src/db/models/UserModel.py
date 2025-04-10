from sqlalchemy import Column, ForeignKey, Integer, String, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from src.db.database import Base  
from src.db.Models.JobModels import Job

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    jobId = Column(Integer,ForeignKey('jobs.id'),nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    phone = Column(String)
    gender = Column(String)
    degree = Column(String)
    status = Column(String)
    CV_FilePath = Column(String)

    videos = relationship("UserVideo", back_populates="user")

class UserVideo(Base):
    __tablename__ = 'userVideos'

    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    videoPath = Column(String, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('userId', 'videoPath'),
    )

    user = relationship("User", back_populates="videos")


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

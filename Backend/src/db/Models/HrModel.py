from sqlalchemy import Column, ForeignKey, Integer, String, Float,Text,PrimaryKeyConstraint,Boolean
from sqlalchemy.orm import relationship
from db.database import Base  

class HR(Base):
    __tablename__ = 'hr'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    # phone_number = Column(String)
    password=Column(String)

    jobs = relationship("Job", back_populates="hr")
    videos_processing = relationship("VideoProcessing", back_populates="hr")

class VideoProcessing(Base):
    __tablename__ = 'video_processing'
    # Foreign keys
    hr_id = Column(Integer, ForeignKey('hr.id'),nullable=False,index=True)
    job_id = Column(Integer, ForeignKey('jobs.id'),nullable=False,index=True)
    user_id = Column(Integer, ForeignKey('users.id'),nullable=False,index=True)
    
    # Data columns
    total_score = Column(Float,default=0.0) 
    
    summarized_text1 = Column(Text)
    summarized_text2 = Column(Text)
    summarized_text3 = Column(Text)
    
    relevance1 = Column(Float,default=0.0)
    relevance2 = Column(Float,default=0.0)
    relevance3 = Column(Float,default=0.0)
    
    total_english_score = Column(Float,default=0.0)
    
    emotion1 = Column(String)
    emotion2 = Column(String)
    emotion3 = Column(String)
    
    trait1 = Column(String)
    trait2 = Column(String)
    trait3 = Column(String)
    trait4 = Column(String)
    trait5 = Column(String)
    
    __table_args__ = (
        PrimaryKeyConstraint('hr_id', 'job_id', 'user_id'),
    )
    
    hr = relationship("HR", back_populates="videos_processing")
    job = relationship("Job", back_populates="videos_processing")
    user = relationship("User", back_populates="videos_processing")
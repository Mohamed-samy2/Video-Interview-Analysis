from sqlalchemy import Column, ForeignKey, Integer, String, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from src.db.database import Base  

class HR(Base):
    __tablename__ = 'hr'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    # phone_number = Column(String)
    password=Column(String)

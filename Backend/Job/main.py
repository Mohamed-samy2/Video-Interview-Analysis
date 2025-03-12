from fastapi import FastAPI,HTTPException,Depends
from typing import List,Annotated
from . import  models,schemas
from .database import engine,SessionLocal
from sqlalchemy.orm import Session


app = FastAPI()

models.Base.metadata.create_all(engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency=Annotated[Session,Depends(get_db)]


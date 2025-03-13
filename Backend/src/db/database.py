from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Annotated
from fastapi import Depends

## create Database first Video-Interview-Analysis
## add the host name and password in the url
## add the database name
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:0000@172.27.80.1/Video-Interview-Analysis"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as db:
        yield db

db_dependency = Annotated[AsyncSession, Depends(get_db)]

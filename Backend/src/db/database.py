from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from typing_extensions import Annotated
#from typing import Annotated
from fastapi import Depends

SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:12345@localhost:5432/Video-Interview-Analysis"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as db:
        yield db

db_dependency = Annotated[AsyncSession, Depends(get_db)]
print("Database initialized.")


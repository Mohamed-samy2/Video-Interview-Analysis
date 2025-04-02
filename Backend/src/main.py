from fastapi import FastAPI
from src.db import models
from src.db.database import engine, Base
import asyncio

app = FastAPI()

# Create database tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def startup_event():
    await create_tables()

# Include routers

# Run with: uvicorn main:app --reload

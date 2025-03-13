from fastapi import FastAPI
from User.routes import user_router
from db.database import engine, Base
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
app.include_router(user_router)
# Run with: uvicorn main:app --reload

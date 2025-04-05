from fastapi import FastAPI
from src.User.routes import user_router
from src.Hr.routes import hr_router
from src.Job.routes import job_router
from src.Ai.Text_Model.routes import gemini_router
from src.Ai.Text_Model.routes import helper_router

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
app.include_router(hr_router)
app.include_router(user_router,prefix="/user", tags=["User"])
app.include_router(job_router, prefix="/job", tags=["Job"])
app.include_router(gemini_router, prefix="/gemini", tags=["Gemini"])
app.include_router(helper_router, prefix="/helper", tags=["Helper"])
# Run with: uvicorn main:app --reload

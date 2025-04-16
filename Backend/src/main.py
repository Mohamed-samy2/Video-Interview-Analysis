from fastapi import FastAPI
from User.routes import user_router
from Hr.routes import hr_router
from Job.routes import job_router
from db.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

import asyncio

app = FastAPI()

# Create database tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def startup_event():
    await create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
# Include routers
app.include_router(hr_router)
app.include_router(user_router,prefix="/user", tags=["User"])
app.include_router(job_router, prefix="/job", tags=["Job"])
# Run with: uvicorn main:app --reload
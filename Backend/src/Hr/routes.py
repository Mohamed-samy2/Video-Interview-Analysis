from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from db.database import get_db
from Hr.schemas import HrCreate, GetHr,GetUserScores,ComputeUserScores
from Hr.service import HrService

hr_router = APIRouter(
    prefix="/hr",
    tags=["HR"]
)

hr_service = HrService()

@hr_router.post("/create", response_model=Dict[str, Any])
async def create_hr(request: HrCreate, db: AsyncSession = Depends(get_db)):
    """Create a new HR user."""
    return await hr_service.create_hr(request, db)

@hr_router.post("/login", response_model=Dict[str, Any])
async def login_hr(request: GetHr, db: AsyncSession = Depends(get_db)):
    """Login for HR users."""
    return await hr_service.hr_login(request, db)

@hr_router.post("/get_user_scores", response_model=Dict[str, Any])
async def get_scores(request: GetUserScores, db: AsyncSession = Depends(get_db)):
    """Get scores for a user."""
    return await hr_service.get_user_scores(request, db)

@hr_router.post("/compute_scores", response_model=Dict[str, Any])
async def compute_scores(request: ComputeUserScores, db: AsyncSession = Depends(get_db)):
    """Compute scores for a user."""
    return await hr_service.compute_scores(request, db)
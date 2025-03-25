from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from db.database import get_db
from Hr.schemas import HrCreate, GetHr
from Hr.service import HrService

hr_router = APIRouter(
    prefix="/hr",
    tags=["HR Management"]
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
    
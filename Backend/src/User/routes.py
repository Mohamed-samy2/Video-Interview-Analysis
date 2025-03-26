from fastapi import APIRouter, UploadFile, File, Depends
from src.User.schemas import UserCreate, ShowUser
from src.User.service import UserService
from src.db.database import db_dependency
from typing import List, Optional
from src.utils import Status

user_router = APIRouter()

@user_router.post("/", response_model=ShowUser)
async def create_user(request: UserCreate, db: db_dependency):
    return await UserService().create_user(request, db)

@user_router.get("/", response_model=List[ShowUser])
async def get_users_by_jobid_status(job_id: int, db: db_dependency, status: Optional[str] =None):
    return await UserService.get_users_by_jobid_status(job_id, status, db)

@user_router.post("/upload-video")
async def upload_video(userId: int,jobId: int,questionId: int, file: UploadFile = File(...), db: db_dependency = db_dependency):
    return await UserService.upload_video(userId, jobId, questionId, file, db)

@user_router.put("/{user_id}/status", response_model=ShowUser)
async def update_user_status(user_id: int, job_id: int, new_status: str, db: db_dependency):
    return await UserService.update_user_status(user_id, job_id, new_status, db)


# @user_router.get("/get-video/{userId}")
# async def get_video(userId: int, db: db_dependency):
#     return await UserService().get_user_video(userId, db)

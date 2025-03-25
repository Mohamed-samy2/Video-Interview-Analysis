from fastapi import APIRouter, UploadFile, File, Depends
from src.User.schemas import UserCreate, ShowUser
from src.User.service import UserService
from src.db.database import db_dependency


user_router = APIRouter()

@user_router.post("/", response_model=ShowUser)
async def create_user(request: UserCreate, db: db_dependency):
    return await UserService().create_user(request, db)

@user_router.post("/upload-video")
async def upload_video(userId: int, file: UploadFile = File(...), db: db_dependency = db_dependency):
    return await UserService().upload_video(userId, file, db)


@user_router.get("/get-video/{userId}")
async def get_video(userId: int, db: db_dependency):
    return await UserService().get_user_video(userId, db)

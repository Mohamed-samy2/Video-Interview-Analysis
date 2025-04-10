from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc
from fastapi import Depends, UploadFile, File, HTTPException
from db.Models import UserModel # Updated import path
from db.Models.HrModel import VideoProcessing # Updated import path
from User.schemas import UserCreate  # Updated import path
import shutil
from pathlib import Path
from fastapi.responses import FileResponse
from utils import Status
from sqlalchemy.future import select
from typing import List, Optional


UPLOAD_DIR = Path("uploads")  # Define upload directory
UPLOAD_DIR.mkdir(exist_ok=True)  # Ensure the folder exists

class UserService:
    async def create_user(self, request: UserCreate, db: AsyncSession):
        new_user = UserModel.User(
            first_name=request.first_name,  # request should be of type UserCreate
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            jobId=request.jobId,
            gender=request.gender,
            degree=request.degree,
            status=Status.PENDING.value
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return {"id": new_user.id}  # Only return the ID as requested
    
    async def get_users_by_jobid_status(job_id: int, status: Optional[str], db: AsyncSession):
        query = select(UserModel.User,
                       VideoProcessing.total_score
                       ).outerjoin(VideoProcessing,
                                   (UserModel.User.id == VideoProcessing.user_id)&
                                   (VideoProcessing.job_id == job_id)
                                   ).where(UserModel.User.jobId == job_id)
        if status is None:
            query = query.where(UserModel.User.status == Status.PENDING.value)
        else:
            query = query.where(UserModel.User.status == status)
        
        query = query.order_by(desc(VideoProcessing.total_score).nulls_last())
        
        result = await db.execute(query)
        rows = result.all()
        
        users = []
        if status == Status.PENDING.value:
            
            for user, total_score in rows:
                user_dict = {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "phone": user.phone,
                    "gender": user.gender,
                    "degree": user.degree,
                    "status": user.status,
                    "CV_FilePath": user.CV_FilePath,
                }
                
                users.append(user_dict)
            
            return users
            
        
        
        for user, total_score in rows:
            
            user_dict = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "gender": user.gender,
                "degree": user.degree,
                "status": user.status,
                "CV_FilePath": user.CV_FilePath,
                "total_score": total_score
            }
            
            users.append(user_dict)

        return users
        
    async def update_user_status(user_id: int, job_id: int, new_status: str, db: AsyncSession):
        query = select(UserModel.User).where(UserModel.User.id == user_id, UserModel.User.jobId == job_id)
        result = await db.execute(query)
        user = result.scalars().first()
        if user:
            user.status = new_status
            await db.commit()
            await db.refresh(user)
        return user

    async def upload_video(userId: int, jobId: int, questionId: int, file: UploadFile, db: AsyncSession):
        # Check if user exists
        user = await db.get(UserModel.User, userId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Define upload path
        user_dir = UPLOAD_DIR / str(jobId) / str(userId) / "videos"
        user_dir.mkdir(parents=True, exist_ok=True)
        file_path = user_dir / f"{questionId}.mp4"

        # Save the file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Store path in DB
        user_video = UserModel.UserVideo(userId=userId, videoPath=str(file_path))
        db.add(user_video)
        await db.commit()
        return {"message": "File uploaded successfully", "file_path": str(file_path)}
    
    async def upload_cv(self, userId: int, jobId: int, file: UploadFile, db: AsyncSession):
        # Check if user exists
        user = await db.get(UserModel.User, userId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Define upload path
        user_dir = UPLOAD_DIR / str(jobId) / str(userId)
        user_dir.mkdir(parents=True, exist_ok=True)
        file_path = user_dir / "cv.pdf"

        # Save the file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Store path in DB
        # user_cv = UserModel.UserCV(userId=userId, cvPath=str(file_path))
        user.CV_FilePath=str(file_path)
        await db.commit()
        await db.refresh(user)
        
        return {"file_path": str(file_path)}


    async def get_user_video(self, userId: int, db: AsyncSession):
        # Fetch the latest video for the user
        result = await db.execute(
            UserModel.UserVideo.__table__.select().where(UserModel.UserVideo.userId == userId)
        )
        user_video = result.fetchone()

        if not user_video:
            raise HTTPException(status_code=404, detail="No video found for this user")

        file_path = Path(user_video.videoPath)

        # Check if file exists
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Video file not found")

        return FileResponse(file_path, media_type="video/mp4", filename=file_path.name)


from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, UploadFile, File, HTTPException
from src.db import models  # Updated import path
from src.User.schemas import UserCreate  # Updated import path
import shutil
from pathlib import Path
from fastapi.responses import FileResponse


UPLOAD_DIR = Path("uploads")  # Define upload directory
UPLOAD_DIR.mkdir(exist_ok=True)  # Ensure the folder exists

class UserService:
    async def create_user(self, request: UserCreate, db: AsyncSession):
        new_user = models.User(name=request.name, email=request.email, phone=request.phone)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    async def upload_video(self, userId: int, file: UploadFile, db: AsyncSession):
        # Check if user exists
        user = await db.get(models.User, userId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Save the file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Store path in DB
        user_video = models.UserVideo(userId=userId, videoPath=str(file_path))
        db.add(user_video)
        await db.commit()
        return {"message": "File uploaded successfully", "file_path": str(file_path)}
    
    async def get_user_video(self, userId: int, db: AsyncSession):
        # Fetch the latest video for the user
        result = await db.execute(
            models.UserVideo.__table__.select().where(models.UserVideo.userId == userId)
        )
        user_video = result.fetchone()

        if not user_video:
            raise HTTPException(status_code=404, detail="No video found for this user")

        file_path = Path(user_video.videoPath)

        # Check if file exists
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Video file not found")

        return FileResponse(file_path, media_type="video/mp4", filename=file_path.name)


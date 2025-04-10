import shutil
from pathlib import Path
from moviepy import VideoFileClip
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

UPLOAD_DIR = Path("uploads")  
UPLOAD_DIR.mkdir(exist_ok=True)  

class HelperText:
    @staticmethod
    async def extract_audio(userId: int, jobId: int, questionId: int , db:AsyncSession):
    
        try:
            
            video_dir = UPLOAD_DIR / str(jobId) / str(userId) / "videos"
            video_path = video_dir / f"{questionId}.mp4"

            
            if not video_path.exists():
                raise HTTPException(status_code=404, detail=f"Video file not found: {video_path}")

            
            audio_dir = UPLOAD_DIR / str(jobId) / str(userId) / "audios"
            audio_dir.mkdir(parents=True, exist_ok=True)
            audio_path = audio_dir / f"{questionId}.mp3"

            
            video = VideoFileClip(str(video_path))
            audio = video.audio
            audio.write_audiofile(str(audio_path))
            video.close()


            return {"message": "Audio extracted successfully", "audio_path": str(audio_path)}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error extracting audio: {e}")
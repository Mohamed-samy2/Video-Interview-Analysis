from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.Ai.Text_Model.schemas import TextRequest, AudioExtractRequest
from src.Ai.Text_Model.Gemini import Gemini
from src.Ai.Text_Model.Helper import HelperText
from src.db.database import get_db  

gemini_router = APIRouter()
helper_router = APIRouter()


@gemini_router.post("/summarize/")
def summarize_text(request: TextRequest):
    gemini = Gemini()
    summary = gemini.summarize(request.text)
    return {"summary": summary}


@gemini_router.post("/correct-grammar/")
async def correct_grammar_text(request: TextRequest):
    gemini=Gemini()
    
    corrected_text = gemini.grammatical_error_correctness(request.text)
    return {"corrected_text": corrected_text}


@gemini_router.post("/relevance-check/")
async def relevance_check(description: str, question: str):
    gemini=Gemini()
    relevance_score = gemini.relevance_check(description, question)
    return {"relevance_score": relevance_score}


@helper_router.post("/extract-audio/")
async def extract_audio(request: AudioExtractRequest, db: AsyncSession = Depends(get_db)):
    """
    Extracts audio from an MP4 video based on jobId, userId, and questionId.
    """
    audio_result = await HelperText.extract_audio(request.userId, request.jobId, request.questionId, db)

    if not audio_result:
        raise HTTPException(status_code=400, detail="Failed to extract audio.")

    return audio_result
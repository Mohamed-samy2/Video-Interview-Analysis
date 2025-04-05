from pydantic import BaseModel

class TextRequest(BaseModel):
    text: str


class RelevanceRequest(BaseModel):
    description: str
    question: str


class AudioExtractRequest(BaseModel):
    jobId: int
    userId: int
    questionId: int
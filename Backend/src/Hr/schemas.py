from pydantic import BaseModel

class HrBase(BaseModel):
    name: str
    email: str
    password: str

class HrCreate(HrBase):
    pass

class GetHr(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True

class GetUserScores(BaseModel):
    user_id: int
    job_id: int
    class Config:
        from_attributes = True
 
class ComputeUserScores(BaseModel):
    user_id: int
    job_id: int
    hr_id: int
    
    class Config:
        from_attributes = True
 
    
class VideoProcessingResponse(BaseModel):
    total_score: float
    summarized_text1: str
    summarized_text2: str
    summarized_text3: str
    total_english_score: float
    

    class Config:
        from_attributes = True
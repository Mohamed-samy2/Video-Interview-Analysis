from pydantic import BaseModel

class UserBase(BaseModel):
    first_name: str
    last_name: str
    jobId:int
    email: str
    phone: str
    gender:str
    degree:str


class UploadCVResponse(BaseModel):
    file_path: str

class UserCreate(UserBase):
    pass

class ShowUser(BaseModel):
    id: int

    class Config:
        from_attributes = True


class UserIDResponse(BaseModel):
    id: int

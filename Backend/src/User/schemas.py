from pydantic import BaseModel

class UserBase(BaseModel):
    first_name: str
    last_name: str
    jobId:int
    email: str
    phone: str
    gender:str
    degree:str


class UserCreate(UserBase):
    pass

class ShowUser(UserBase):
    id: int

    class Config:
        from_attributes = True

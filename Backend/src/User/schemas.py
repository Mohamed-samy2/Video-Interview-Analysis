from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    phone: str

class UserCreate(UserBase):
    pass

class ShowUser(UserBase):
    id: int

    class Config:
        from_attributes = True

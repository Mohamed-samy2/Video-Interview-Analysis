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

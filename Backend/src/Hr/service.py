from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status
from db.Models import HrModel  # Updated import path
from Hr.schemas import HrCreate,GetHr  # Updated import path
from fastapi.responses import  JSONResponse


class HrService:
    async def create_hr(self, request: HrCreate, db: AsyncSession):
        existing_hr = await db.execute(
            HrModel.HR.__table__.select().where(HrModel.HR.email == request.email)
        )
        
        if existing_hr.scalar():
            return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"response":False}
        )
        
        new_hr = HrModel.HR(name=request.name, email=request.email, password=request.password)
        db.add(new_hr)
        await db.commit()
        await db.refresh(new_hr)
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"response":True}
        )
    
    async def hr_login(self,request:GetHr,db:AsyncSession):
        result = await db.execute(
            HrModel.HR.__table__.select().where(
                (HrModel.HR.email == request.email)&
                (HrModel.HR.password == request.password)
                )
        )
        
        hr = result.scalars().first()
        if hr:
            
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"id": hr}
            )
            
        else:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"id": 0}
            )
            
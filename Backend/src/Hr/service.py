from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status
from db.Models import HrModel,JobModels,UserModel  # Updated import path
from Hr.schemas import HrCreate,GetHr,GetUserScores  # Updated import path
from fastapi.responses import  JSONResponse
from sqlalchemy.future import select

class HrService:
    async def create_hr(self, request: HrCreate, db: AsyncSession):
        existing_hr = await db.execute(
            select(HrModel.HR).where(HrModel.HR.email == request.email)
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
            select(HrModel.HR).where(
                (HrModel.HR.email == request.email)&
                (HrModel.HR.password == request.password)
                )
        )
        
        hr_record = result.scalar()
        hr = hr_record.id if hr_record else None
        
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
            
    async def get_user_scores(self,request:GetUserScores,db:AsyncSession):
        
        query = select(
                HrModel.VideoProcessing,
                JobModels.JobQuestion.question,
                UserModel.User
            ).outerjoin(
                JobModels.JobQuestion, 
                HrModel.VideoProcessing.job_id == JobModels.JobQuestion.job_id
            ).outerjoin(
                UserModel.User,
                HrModel.VideoProcessing.user_id == UserModel.User.id
            ).where(
                (HrModel.VideoProcessing.user_id == request.user_id) &
                (HrModel.VideoProcessing.job_id == request.job_id)
            )
            
        result = await db.execute(query)
        records = result.all()
        if not records:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"response":None}
            )
        
        response = {}
        
        user = records[0][2]
        response["first_name"] = user.first_name
        response["last_name"] = user.last_name
        response["email"] = user.email
        response["phone"] = user.phone
        response['cv'] = user.CV_FilePath
        
        questions = []
        
        
        for record in records:
            question_data = {
                "question": record[1],
            }
            questions.append(question_data)
            
        questions[0]["summary"] = records[0][0].summarized_text1
        questions[1]["summary"] = records[0][0].summarized_text2
        questions[2]["summary"] = records[0][0].summarized_text3
        
        questions[0]["relevance"] = records[0][0].relevance1
        questions[1]["relevance"] = records[0][0].relevance2
        questions[2]["relevance"] = records[0][0].relevance3
        response["questions"] = questions
        
        return response
            
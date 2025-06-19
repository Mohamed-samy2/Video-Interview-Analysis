from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status
from db.Models import HrModel,JobModels,UserModel  # Updated import path
from Hr.schemas import HrCreate,GetHr,GetUserScores,ComputeUserScores  # Updated import path
from fastapi.responses import  JSONResponse
from sqlalchemy.future import select
from Ai.Video_Model.Video_PersonalityTraits import Video_PersonalityTraits
from Ai.Video_Model.facial_expressions import VideoEmotionAnalyzer
from Ai.Text_Model.Helper import HelperText
from Ai.Text_Model.Gemini import Gemini
from Ai.Text_Model.PredictPersonality import PredictPersonality
from Ai.Audio_Model.English_Evaluation import AudioModel
from Ai.Video_Model.Cheating_Detection import CheatingDetection
import numpy as np
import gc
import torch

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
                JobModels.JobQuestion,
                UserModel.User,
                UserModel.UserVideo
            ).outerjoin(
                JobModels.JobQuestion, 
                JobModels.JobQuestion.job_id == HrModel.VideoProcessing.job_id
            ).outerjoin(
                UserModel.User,
                HrModel.VideoProcessing.user_id == UserModel.User.id
            ).outerjoin(
                UserModel.UserVideo,
                UserModel.UserVideo.userId == request.user_id
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
        response["user_id"] = user.id
        response["first_name"] = user.first_name
        response["last_name"] = user.last_name
        response["email"] = user.email
        response["phone"] = user.phone
        response['cv'] = user.CV_FilePath
        
        questions = []
        i=0
        for record in records:
            if i==3:
                break
            question_data = {
                "question": record[1].question,
                "video":record[3].videoPath
            }
            i+=1
            questions.append(question_data)
        
        
        questions[0]["summary"] = records[0][0].summarized_text1
        questions[1]["summary"] = records[0][0].summarized_text2
        questions[2]["summary"] = records[0][0].summarized_text3
        
        questions[0]["relevance"] = records[0][0].relevance1
        questions[1]["relevance"] = records[0][0].relevance2
        questions[2]["relevance"] = records[0][0].relevance3
        
        questions[0]["emotion"] = records[0][0].emotion1
        questions[1]["emotion"] = records[0][0].emotion2
        questions[2]["emotion"] = records[0][0].emotion3
        
        response["questions"] = questions
        response["total_score"] = records[0][0].total_score
        response['total_english_score']= records[0][0].total_english_score
        
        response['trait1'] = records[0][0].trait1
        response['trait2'] = records[0][0].trait2
        response['trait3'] = records[0][0].trait3
        response['trait4'] = records[0][0].trait4
        response['trait5'] = records[0][0].trait5
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=response
        )
    
    async def compute_scores(self,request:ComputeUserScores,db:AsyncSession):
        # Prepare the query to fetch user videos
        query = select(UserModel.UserVideo).where(
            UserModel.UserVideo.userId == request.user_id
        )
        # Execute the query to get the user videos
        videos = await db.execute(query)
        videos = videos.scalars().all()
        video_paths = [video.videoPath for video in videos]
        
        # Prepare the query to fetch job questions
        query = select(JobModels.JobQuestion).where(
            JobModels.JobQuestion.job_id == request.job_id
        )
        
        # Execute the query to get the job questions
        questions = await db.execute(query)
        questions = questions.scalars().all()
        questions = [question.question for question in questions]
        
        
        audio_paths = []
        video_traits = []
        emotions = []
        texts = []
        summarizations = []
        relevance = []
        text_traits = []
        english_scores = []
        cheating = []
        
        video_traits_model = Video_PersonalityTraits()
        video_emotion_model = VideoEmotionAnalyzer()
        CheatingDetection_model = CheatingDetection()
        print("debuggggg")
        for video_path in video_paths:
            gc.collect()
            torch.cuda.empty_cache()
            video_traits.append(video_traits_model.process_new_video(video_path))
            emotions.append(video_emotion_model.analyze_video(video_path))
            audio_paths.append(HelperText.extract_audio(request.user_id, request.job_id, video_path.split("/")[-1].split(".")[0]))
            cheating.append(await CheatingDetection_model.detect_gaze_cheating_async(video_path))

        print("Video processing loop completed. Video traits:", len(video_traits), "Emotions:", len(emotions), "Audio paths:", len(audio_paths), "Cheating:", len(cheating))

        del video_traits_model
        del video_emotion_model
        gc.collect()
        torch.cuda.empty_cache()
        # Process the audio files and transcribe them
        for audio_path in audio_paths:
            gc.collect()
            torch.cuda.empty_cache()
            texts.append(await HelperText.transcribe_audio(audio_path))
        print("Audio transcription loop completed. Texts generated:", len(texts))
        
        
        llm = Gemini()
        for text , question in zip(texts, questions):
            summarizations.append(llm.summarize(text))
            relevance.append(llm.relevance_check(text, question))
        print("LLM processing loop completed. Summarizations:", len(summarizations), "Relevance scores:", len(relevance))
        
        del llm
        
        text_traits_model = PredictPersonality()
        
        for text in texts:
            gc.collect()
            torch.cuda.empty_cache()
            text_traits.append(text_traits_model.predict(text))
        print("Text traits prediction loop completed. Text traits:", len(text_traits))
        
        del text_traits_model
        gc.collect()
        torch.cuda.empty_cache()
        
        english_model = AudioModel()
        
        for audio_path,text in zip(audio_paths,texts):
            english_scores.append(english_model.run(text,audio_path))
        print("English scoring loop completed. English scores:", len(english_scores))
        
        print("English scores:", english_scores)
        total_english_score = english_model.get_total_applicant_score(english_scores)  
         
        del english_model
        gc.collect()
        torch.cuda.empty_cache()
        
        
        trait_order = ['AGR', 'CONN', 'EXT', 'NEU', 'OPN']

        combined_traits = []
        for v_traits, t_traits in zip(video_traits, text_traits):
            combined = [
                0.7 * v + 0.3 * t_traits[k]
                for v, k in zip(v_traits, trait_order)
            ]
            combined_traits.append(combined)
        
        combined_traits = np.mean(combined_traits, axis=0)
        combined_traits = combined_traits.tolist()
        
        emotions = [e['Assessment'] for e in emotions]
        
        avg_relevance = sum(relevance) / len(relevance)
        avg_traits = sum(combined_traits) / len(combined_traits)
        
        total_score = (0.8*avg_relevance) + (0.7*avg_traits)+ (0.6* total_english_score)
        
        video_processing = HrModel.VideoProcessing(
            hr_id=request.hr_id,
            job_id=request.job_id,
            user_id=request.user_id,
            total_score=round(total_score),
            summarized_text1=summarizations[0],
            summarized_text2=summarizations[1],
            summarized_text3=summarizations[2],
            relevance1=relevance[0],
            relevance2=relevance[1],
            relevance3=relevance[2],
            total_english_score=round(total_english_score),
            emotion1=emotions[0],
            emotion2=emotions[1],
            emotion3=emotions[2],
            trait1 =  "Authentic" if  combined_traits[0] > 0.5 else "Self-Intersted",
            trait2 = "Organized" if combined_traits[1] > 0.5 else "Sloppy",
            trait3 = "Friendly" if combined_traits[2] > 0.5 else "Reserved",
            trait4 = "Comfortable" if combined_traits[3] > 0.5 else "Uneasy",
            trait5 = "Imaginative" if combined_traits[4] > 0.5 else "Practical"
        )
        
        db.add(video_processing)
        await db.commit()
        await db.refresh(video_processing)
        
        return JSONResponse(
            content = {"response":'success'},
            status_code = status.HTTP_200_OK
        )

        
# from pathlib import Path
# from moviepy.editor import VideoFileClip
# from fastapi import HTTPException
# from transformers import BertTokenizer, BertModel
# import preprocessor as p
# import re
# from sqlalchemy.ext.asyncio import AsyncSession
# import whisper 
# import torch
# UPLOAD_DIR = Path("uploads")
# UPLOAD_DIR.mkdir(exist_ok=True)

# #class Helper:
#     def __init__(self):
#         self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
#         self.model = BertModel.from_pretrained("bert-base-uncased")

#     def get_bert_model(self):
#         return self.tokenizer, self.model

#     def preprocess_text(self, sentence: str) -> str:
        
#         sentence = p.clean(sentence)
#         sentence = re.sub(r"http\S+", " ", sentence)
#         sentence = re.sub(r"\s+", " ", sentence).strip()
#         sentence = re.sub(r"\|\|\|", " ", sentence)
#         return sentence

# class HelperText:
#     @staticmethod
#     def extract_audio(userId: int, jobId: int, questionId: int):
#         try:
#             video_dir = UPLOAD_DIR / str(jobId) / str(userId) / "videos"
#             video_path = video_dir / f"{questionId}.mp4"

#             if not video_path.exists():
#                 raise HTTPException(status_code=404, detail=f"Video file not found: {video_path}")

#             audio_dir = UPLOAD_DIR / str(jobId) / str(userId) / "audios"
#             audio_dir.mkdir(parents=True, exist_ok=True)
#             audio_path = audio_dir / f"{questionId}.mp3"

#             video = VideoFileClip(str(video_path))
#             audio = video.audio
#             audio.write_audiofile(str(audio_path))
#             video.close()

#             return str(audio_path)

#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Error extracting audio: {e}")

#     @staticmethod
#     async def transcribe_audio(audio_path: str) -> str:
#         # try:
#             # detection_model = whisper.load_model("large")         #for language detection
#             # print(detection_model.device)
#             device = 'cuda' if torch.cuda.is_available() else 'cpu'

#             audio = whisper.load_audio(audio_path)
#             audio = whisper.pad_or_trim(audio)
#             # mel = whisper.log_mel_spectrogram(audio).to(detection_model.device)
#             # _, probs = detection_model.detect_language(mel)
#             # detected_lang = max(probs, key=probs.get)
#             # confidence = probs[detected_lang]
#             # print(f"Detected Language: {detected_lang} (Confidence: {confidence})")
#             # is_english = detected_lang == "en" and confidence > 0.8
#             # if is_english:
            
#             transcription_model = whisper.load_model("medium.en",device=device)  #for English transcription only
#             result = transcription_model.transcribe(audio_path)
#             transcription = result["text"]
#             # else:
#                 # transcription = ""

#             return transcription

#         # except Exception as e:
#         #     raise HTTPException(status_code=500, detail=f"Error transcribing audio: {e}")



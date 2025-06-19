import cv2
import json
import numpy as np
from deepface import DeepFace
from collections import defaultdict
from pathlib import Path

UPLOAD_DIR = Path("uploads")  # Define upload directory
UPLOAD_DIR.mkdir(exist_ok=True)  # Ensure the folder exists


class VideoEmotionAnalyzer:
    def __init__(self):
        
        self.face_model = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.positive_emotions = {"happy", "neutral", "surprise"}
        self.negative_emotions = {"sad", "angry", "fear", "disgust"}

    @staticmethod
    def convert_numpy_floats(data):
        """ Convert NumPy float32 values to Python float for JSON serialization. """
        if isinstance(data, dict):
            return {k: VideoEmotionAnalyzer.convert_numpy_floats(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [VideoEmotionAnalyzer.convert_numpy_floats(v) for v in data]
        elif isinstance(data, (np.float32, np.float64)):
            return float(data)
        else:
            return data

    def analyze_video(self,video_path):
        cap = cv2.VideoCapture(video_path)
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps

        print(f"Video FPS: {fps}, Duration: {duration:.2f}s, Total Frames: {total_frames}")
        
        total_emotions = defaultdict(float)
        num_frames_processed = 0
        
        for second in range(int(duration)):
            for i in range(5):  # Analyze 5 frames per second
                frame_idx = (second * fps) + (i * (fps // 5))
                if frame_idx >= total_frames:
                    break
                
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if not ret:
                    continue
                
                try:
                    result = DeepFace.analyze(
                        frame,
                        actions=['emotion'],
                        enforce_detection=True,
                        detector_backend='retinaface'
                    )

                    if isinstance(result, list):
                        result = result[0]

                    emotion_scores = result.get('emotion', {})
                    for emotion, score in emotion_scores.items():
                        total_emotions[emotion] += score

                    num_frames_processed += 1

                except Exception as e:
                    print(f"Frame {frame_idx} skipped due to error: {e}")
                    continue


        cap.release()
        
        if num_frames_processed == 0:
            print("No faces detected in the video.")
            return {}
        
        final_emotion_scores = {k: v / num_frames_processed for k, v in total_emotions.items()}
        dominant_emotion = max(final_emotion_scores, key=final_emotion_scores.get)
        
        positive_score = sum(final_emotion_scores.get(em, 0) for em in self.positive_emotions)
        negative_score = sum(final_emotion_scores.get(em, 0) for em in self.negative_emotions)
        
        if positive_score > negative_score:
            emotional_assessment = "The candidate appeared confident and engaged."
        elif negative_score > positive_score:
            emotional_assessment = "The candidate might have felt nervous, frustrated, or disengaged."
        else:
            emotional_assessment = "The candidate had mixed reactions, indicating varying confidence levels."
        
        report_data = {
            "Dominant Emotion": dominant_emotion,
            "Emotion Distribution": final_emotion_scores,
            "Assessment": emotional_assessment
        }
        
        report_data = self.convert_numpy_floats(report_data)
                
        print("Report Generated Successfully!")
        return report_data


# # Example usage
# video_path = "/content/-55DRRMTppE.000.mp4"
# report = analyze_video(video_path)
# print(report)
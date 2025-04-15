import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import av
import os
from torchvision import transforms
from facenet_pytorch import MTCNN
from .X3D_Model import x3d_model

class Video_PersonalityTraits:
    
    def __init__(self, frame_count=30, image_size=160, margin=40):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.frame_count = frame_count
        self.image_size = image_size
        self.face_detector = MTCNN(image_size=image_size, margin=margin, post_process=False, select_largest=True, device=self.device)
        self.model = x3d_model('x3d_s')
        self.model.load_state_dict(torch.load(os.path.join(os.path.dirname(__file__), "X3D_Third_CheckPoint (1).pth")))
        self.model = self.model.to(self.device)
        self.model.eval()
        
    
    def process_new_video(self, video_path):
        
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")
        
        frames = self.extract_frames(video_path)
        frames = frames.unsqueeze(0).to(self.device)
        frames = frames.permute(0, 2, 1, 3, 4)
        
        with torch.no_grad():
            predictions = self.model(frames)
        
        return predictions.cpu().numpy().tolist()[0]

    def extract_faces(self,frames):
        """Detect and crop faces."""
        face_tensors = []
        for frame in frames:
            img = transforms.ToPILImage()(frame)
            face = self.face_detector(img)
            if face is not None:
                face_tensors.append(face)
            if len(face_tensors) >= self.frame_count:
                break
        return self.pad_frames(face_tensors)
    
    def pad_frames(self,frames):
        """Ensure exactly `frame_count` frames are returned."""
        if len(frames) == 0:
            return torch.zeros(self.frame_count, 3, self.image_size, self.image_size)

        num_frames = len(frames)
        if num_frames < self.frame_count:
            indices = np.linspace(0, num_frames - 1, self.frame_count, dtype=int)
            frames = [frames[i] for i in indices]
        else:
            frames = frames[:self.frame_count]

        return torch.stack(frames)
    
    def extract_frames(self,video_path):
        """Extracts 60 evenly spaced frames from a video."""
        try:
            container = av.open(video_path)
        except Exception as e:
            print(f"[ERROR] Could not open video: {video_path} ({e})")
            return torch.zeros(self.frame_count, 3, self.image_size, self.image_size)

        frames = []
        total_frames = container.streams.video[0].frames
        indices = np.linspace(0, total_frames - 1, 60, dtype=int)

        for i, frame in enumerate(container.decode(video=0)):
            if i in indices:
                img = frame.to_ndarray(format="rgb24")
                img = torch.tensor(img, dtype=torch.float32).permute(2, 0, 1) / 255.0
                frames.append(img)
            if len(frames) >= 60:
                break

        if len(frames) == 0:
            print(f"[WARNING] No frames found in {video_path}, returning black frames.")
            return torch.zeros(self.frame_count, 3, self.image_size, self.image_size)

        return self.extract_faces(frames)
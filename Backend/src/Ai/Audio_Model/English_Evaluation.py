import torch
import torch.nn.functional as F
import torchaudio.transforms as T
from transformers import AutoTokenizer
import math
import librosa
from typing import List
import os
from .EnglishModel import EnglishModel

class AudioModel:
    def __init__(self, llm_name = 'answerdotai/ModernBERT-base', speech_encoder_name = "jonatasgrosman/wav2vec2-large-xlsr-53-english",apply_preprocessing=False):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model = EnglishModel(llm_name=llm_name,speech_encoder_name=speech_encoder_name)
        self.model.load_state_dict(torch.load(os.path.join(os.path.dirname(__file__), "EnglishModel_weights_best_epoch.pth"),weights_only=True))
        self.model = self.model.to(self.device)
        self.model.eval()
        self.tokenizer = AutoTokenizer.from_pretrained(llm_name)
        self.apply_preprocessing = apply_preprocessing
        self.target_sample_rate = 16000
        self.mean_waveform_length = 80000  # 5 seconds at 16kHz

    def resample_audio(self,original_sample_rate,waveform):
        if original_sample_rate != self.target_sample_rate:
            transform = T.Resample(original_sample_rate, self.target_sample_rate)
            waveform = transform(waveform)
        return waveform

    def pad_short_audio(self, waveform, chunk_length=80000):
        if waveform.size(1) < chunk_length:
            pad_size = chunk_length - waveform.size(1)
            waveform = F.pad(waveform, (0, pad_size))
        return waveform

    def split_waveform(self, waveform, segment_length=80000):
        total_length = waveform.size(1)
        num_segments = math.ceil(total_length / segment_length)
        print(f"Splitting audio into {num_segments} chunks")
        segments = []
        for i in range(num_segments):
            start = i * segment_length
            end = start + segment_length
            segment = waveform[:, start:end]
            if segment.size(1) < segment_length:
                segment = self.pad_short_audio(segment, segment_length)
            segments.append(segment)
        return segments

    def prepare_inputs_for_model(self, text, audio_path, device,text_max_length=12):
        waveform, sample_rate = librosa.load(audio_path, sr=self.target_sample_rate)
        waveform = torch.tensor(waveform).unsqueeze(0)
        # waveform, sample_rate = torchaudio.load(audio_path)
        waveform = self.resample_audio(sample_rate, waveform)

        # pre processing
        if self.apply_preprocessing:
          tokenized_outputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True,max_length=text_max_length).to(device)  ## Pad text with max length for tokens

          if waveform.size(1) > self.mean_waveform_length:
                waveform_chunks = self.split_waveform(waveform.to(device))
          else:
             waveform_chunks = [self.pad_short_audio(waveform).to(device)]

        else:
            tokenized_outputs = self.tokenizer(text, return_tensors="pt").to(device)
            waveform_chunks = [waveform.to(device)]

        return waveform_chunks, tokenized_outputs.input_ids, tokenized_outputs.attention_mask

    def get_model_output(self, waveform, input_ids, attention_mask):
        torch.cuda.empty_cache()
        with torch.no_grad():
            output = self.model(input_ids=input_ids, waveforms=waveform,attention_masks=attention_mask)
        
        preds = torch.round(output).long().squeeze(0)
        accuracy, fluency, completeness, prosodic, total = preds.tolist()
        print(f"Accuracy: {accuracy}")
        print(f"Fluency: {fluency}")
        print(f"Prosodic: {prosodic}")
        print(f"Comp: {completeness}")
        print(f"Total: {total}")

        weighted_score = (1*accuracy + 1*fluency + 0.8*prosodic + 0.2*completeness + 1*total) / (1+1+0.8+0.2+1)
        return weighted_score

    def run(self, audio_transcript, audio_path):
        chunks, input_ids, attn_mask = self.prepare_inputs_for_model(audio_transcript, audio_path, self.device)
        scores = []
        i = 1
        for chunk in chunks:
            print(f"Chunk number {i}:")
            score = self.get_model_output(chunk, input_ids, attn_mask)
            scores.append(score)
            print("****************************")
            i+=1
        return sum(scores) / len(scores)  # Audio score

    def get_total_applicant_score(self, scores: List[float]):
        return sum(scores) / len(scores)
from src.Ai.Text_Model.helper import Helper
import torch
import numpy as np
from pathlib import Path
import sys
import re
import tensorflow as tf
import joblib


class PredictPersonality:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        if torch.cuda.is_available():
            print("GPU found (", torch.cuda.get_device_name(torch.cuda.current_device()), ")")
            torch.cuda.set_device(torch.cuda.current_device())
            print("num device avail: ", torch.cuda.device_count())
        else:
            print("Running on CPU")

    def extract_bert_features(self, text, tokenizer, model, token_length, overlap=256):
        tokens = tokenizer.tokenize(text)
        n_tokens = len(tokens)
        
        start, segments = 0, []
        while start < n_tokens:
            end = min(start + token_length, n_tokens)
            segment = tokens[start:end]
            segments.append(segment)
            if end == n_tokens:
                break
            start = end - overlap

        embeddings_list = []
        with torch.no_grad():
            for segment in segments:
                inputs = tokenizer(
                    " ".join(segment), return_tensors="pt", padding=True, truncation=True
                )
                inputs = inputs.to(self.device)
                outputs = model(**inputs)
                embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
                embeddings_list.append(embeddings)

        if len(embeddings_list) > 1:
            embeddings = np.concatenate(embeddings_list, axis=0)
            embeddings = np.mean(embeddings, axis=0, keepdims=True)
        else:
            embeddings = embeddings_list[0]

        return embeddings

    def load_finetune_model(self, model_directory):
        models = {}

        # Ensure the directory exists
        if not Path(model_directory).is_dir():
            print(f"Directory not found: {model_directory}")
            sys.exit(0)

        # Iterate over all model files in the directory
        for model_path in Path(model_directory).glob("*.*"):
            model_name = model_path.stem  # Extract model name (without extension)
            print(f"Loading model: {model_path}")

            try:
                if model_path.suffix == ".h5":
                    models[model_name] = tf.keras.models.load_model(str(model_path))
                elif model_path.suffix == ".pkl":
                    models[model_name] = joblib.load(str(model_path))
                else:
                    print(f"Skipping unsupported file: {model_path}")
            except Exception as e:
                print(f"Failed to load {model_path}: {e}")

        return models

    def softmax(self, x):
        exp_x = np.exp(x)
        return exp_x / np.sum(exp_x)

    def predict(self, new_text: str):
        helper_instance = Helper()

        token_length = 512
        new_text_pre = helper_instance.preprocess_text(sentence=new_text)

        tokenizer, model = helper_instance.get_bert_model()
        model.to(self.device)

        new_embeddings = self.extract_bert_features(new_text_pre, tokenizer, model, token_length)

        op_dir = '.\\src\\Ai\\Text_Model\\Models\\'

        models = self.load_finetune_model(op_dir)
        predictions = {}

        for trait, model in models.items():
            try:
                prediction = model.predict(new_embeddings)
                prediction = self.softmax(prediction)
                prediction = prediction[0][1]
                predictions[trait] = float(prediction)  # Convert numpy.float32 to Python float
            except BaseException as e:
                print(f"Failed to make prediction: {e}")

        return predictions

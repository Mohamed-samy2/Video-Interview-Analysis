from transformers import BertTokenizer, BertModel
import preprocessor as p
import re

class Helper:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        self.model = BertModel.from_pretrained("bert-base-uncased")

    def get_bert_model(self):
        return self.tokenizer, self.model

    def preprocess_text(self, sentence: str) -> str:
        # Remove hyperlinks, hashtags, smileys, emojis
        sentence = p.clean(sentence)
        # Remove hyperlinks
        sentence = re.sub(r"http\S+", " ", sentence)
        # Remove multiple spaces and unwanted characters
        sentence = re.sub(r"\s+", " ", sentence).strip()
        sentence = re.sub(r"\|\|\|", " ", sentence)
        return sentence

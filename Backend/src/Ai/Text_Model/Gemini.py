import google.generativeai as genai
from dotenv import load_dotenv
import os

class Gemini:
    
    def __init__(self):
        """Initialize the Gemini client with API key and settings."""
        load_dotenv()
        # if not api_key:
        #     raise ValueError("GEMINI_API_KEY is missing.")

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(
            "gemini-2.0-flash",
            generation_config={
                "temperature": 0,
                "top_k": 1
            }
        )

    def summarize(self, text: str) -> str:
        """Summarize the transcribed interview response using Gemini API."""
        prompt = f"""
        You are an AI assistant specializing in summarizing job interview responses. Your task is to generate a **clear, well-structured, and natural-sounding summary** of the candidate's answer while keeping it concise and professional.

        - Ensure the summary is written **in a natural, flowing paragraph**, not bullet points.
        - Maintain **the key ideas** from the response while eliminating unnecessary details.
        - Keep the tone **formal, coherent, and human-like** as if it were written by a professional recruiter.

        Here is the candidate's response:

        "{text}"

        Now, provide a well-written summary in paragraph form that retains the most important information from the response.
        """

        response = self.model.generate_content(prompt)
        return response.text


    def relevance_check(self, text: str, question: str) -> str:
        """Evaluate the relevance of an interview question based on the job description."""
        prompt = f"""You are an **AI-powered interviewer assistant** evaluating the relevance of an interview question.
 
        ### **Task:**
        - Determine how **relevant** the question is to assessing the candidate.
        - Use the provided **candidate's answer** to help contextualize the evaluation.
        - Provide a **single numerical score (0-10)** where:
        - **0** = Completely irrelevant
        - **10** = Highly relevant
    
        ### **Interview Question:**
        "{question}"
    
        ### **Candidate's Answer:**
        "{text}"
    
        ### **Output Format:**
        Provide **only** a single number between **0 and 10** representing the relevance score.
        """

        response = self.model.generate_content(prompt)
        return int(response.text)  

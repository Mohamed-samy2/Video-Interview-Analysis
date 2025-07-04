![PRVIA](<PRVIA logo.png>)

# PRVIA (Pre-Recorded Video Interview Analysis)

PRVIA is an AI-powered system that automates the evaluation of pre-recorded job interviews by analyzing candidates’ speech, language, facial expressions, and personality traits. Delivered via a web platform, it generates comprehensive scores in under two minutes, helping reduce evaluation bias, match human performance, and streamline large-scale hiring with fairness and consistency

## Key Capabilities

- **Video Analysis:** Uses MTCNN for face detection and X3D for spatiotemporal feature extraction to predict Big Five personality traits. Eye gaze is tracked with BlazeFace and MediaPipe to detect cheating, while DeepFace monitors emotional expressions.
- **Audio Processing:** Extracts audio with MoviePy, transcribes it using Whisper, and combines Wav2Vec2 and ModernBERT features through cross-attention and Transformer encoders to assess pronunciation (fluency, accuracy, prosody, completeness).
- **Text Evaluation:** Summarizes transcribed responses using Gemini, and checks semantic relevance between answers and questions via prompt-based classification using the Gemini API.
- **Text-Based Personality Prediction:** Analyzes transcripts to infer personality traits from language, enhancing the video-based predictions.
- **System Integration:** Aggregates results from all modules through a FastAPI backend and PostgreSQL database, with outputs delivered via a React-based web interface for HR review.

## Getting Started

### Deploy with Docker

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Mohamed-samy2/Video-Interview-Analysis.git
    cd Video-Interview-Analysis
    ```

2. **Create Enviroment Files:**

    Inside `Backend/src`

    ```bash
    cp .env.example .env
    ```

    Add the following to `.env`

    ```bash
    GEMINI_API_KEY=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    POSTGRES_HOST=
    POSTGRES_PORT=
    ```

3. **Run with Docker Compose:**

    ```bash
    docker-compose up --build
    ```

4. **Access the App:**

    Frontend: <http://localhost:3000>

## License

MIT License. See [LICENSE](https://choosealicense.com/licenses/mit/) for details.

## Authors

- Mohamed Samy [Linkedin](https://www.linkedin.com/in/mohamed-samy02/) | [GitHub](https://github.com/Mohamed-samy2)

- Yomna Mohamed [Linkedin](https://www.linkedin.com/in/yomna-bassam70/) | [GitHub](https://github.com/yomnamuhammedd)

- Mohamed Ashraf [Linkedin](http://www.linkedin.com/in/mohamed-mahran-002b9b24b) | [GitHub](https://github.com/MohamedMahran02)

- Nadine Haitham [Linkedin](http://www.linkedin.com/in/nadine-elkady-4b45792b1) | [GitHub](https://github.com/nadinehaitham)

- Ammar Mohamed [Linkedin](http://www.linkedin.com/in/ammar-desouki) | [GitHub](https://github.com/ammar7018)

- Youssef Tamer [Linkedin](https://www.linkedin.com/in/youssef-tamer-844870209/) | [GitHub](https://github.com/yousseftamer)

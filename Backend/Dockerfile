FROM python:3.10.16-slim

WORKDIR /app

# Install FFmpeg and system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
# Copy code
COPY /src /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download models
RUN chmod +x download_models.sh && ./download_models.sh

# Expose port
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

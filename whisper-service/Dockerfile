FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir torch torchaudio --index-url https://download.pytorch.org/whl/cpu

RUN python -c "import whisper; whisper.load_model('base')"

COPY . .

EXPOSE 5000

CMD ["python", "flask_app.py", "--host=0.0.0.0", "--port=5000"]

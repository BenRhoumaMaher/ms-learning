# Use Python 3.10 slim base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir torch torchaudio --index-url https://download.pytorch.org/whl/cpu

# Pre-download Whisper base model
RUN python -c "import whisper; whisper.load_model('base')"

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run Flask app
CMD ["python", "flask_app.py", "--host=0.0.0.0", "--port=5000"]
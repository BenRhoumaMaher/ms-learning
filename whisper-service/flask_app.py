from flask import Flask, request, jsonify
import whisper  # This will now correctly import openai-whisper
import tempfile
import os
from deep_translator import GoogleTranslator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize model inside a function to handle loading properly
def get_model():
    return whisper.load_model("base")

@app.route("/transcribe", methods=["POST"])
def transcribe():
    model = get_model()  # Load model when needed
    video = request.files["video"]
    lang = request.form.get("lang", "fr")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
        video.save(temp.name)
        result = model.transcribe(temp.name)

    translated_segments = []
    for segment in result["segments"]:
        translated_text = GoogleTranslator(source="auto", target=lang).translate(segment["text"])
        translated_segments.append({
            "start": segment["start"],
            "end": segment["end"],
            "text": translated_text
        })

    os.remove(temp.name)
    return jsonify({"segments": translated_segments})

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"status": "Backend is working!"})

@app.route("/translate-text", methods=["POST"])
def translate_text():
    text = request.form.get("text")
    lang = request.form.get("lang", "fr")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        translated = GoogleTranslator(source="auto", target=lang).translate(text)
        return jsonify({"translated": translated})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    


    
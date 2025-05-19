from flask import Flask, request, jsonify
import whisper
import tempfile
import os
from deep_translator import GoogleTranslator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_model():
    return whisper.load_model("base")

@app.route("/transcribe", methods=["POST"])
def transcribe():
    model = get_model()
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

@app.route("/generate-notes", methods=["POST"])
def generate_notes():
    model = get_model()
    video = request.files["video"]
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
        video.save(temp.name)
        result = model.transcribe(temp.name)
    
    full_text = " ".join([segment["text"] for segment in result["segments"]])
    
    # Generate summary (existing functionality)
    summary_segments = [
        result["segments"][0]["text"],
        result["segments"][len(result["segments"])//2]["text"],
        result["segments"][-1]["text"]
    ]
    summary = " ".join(summary_segments)
    
    # Generate flashcards (new functionality)
    flashcards = generate_flashcards(result["segments"])
    
    os.remove(temp.name)
    return jsonify({
        "summary": summary,
        "full_transcript": full_text,
        "flashcards": flashcards
    })
    
def generate_flashcards(segments):
    flashcards = []
    
    # Process segments to identify important sentences
    for i, segment in enumerate(segments):
        text = segment["text"].strip()
        
        # Skip very short segments or segments that are likely not informative
        if len(text) < 15 or not any(char.isalpha() for char in text):
            continue
            
        # Identify segments that likely contain key information
        if (any(keyword in text.lower() for keyword in ["important", "key", "remember", "note", "concept"]) or
            text.endswith("?") or
            i == 0 or i == len(segments) - 1 or
            i % (len(segments) // 5 + 1) == 0):  # Sample evenly throughout the video
            
            # Create a flashcard
            if text.endswith("?"):
                # Question-answer format
                if i + 1 < len(segments):
                    flashcards.append({
                        "front": text,
                        "back": segments[i + 1]["text"].strip()
                    })
            else:
                # Key point format
                # Extract the main concept (first part of sentence)
                parts = text.split(",", 1)
                if len(parts) > 1:
                    flashcards.append({
                        "front": parts[0].strip() + "?",
                        "back": text
                    })
                else:
                    parts = text.split(":", 1)
                    if len(parts) > 1:
                        flashcards.append({
                            "front": parts[0].strip() + "?",
                            "back": parts[1].strip()
                        })
                    else:
                        # Create a "What is..." flashcard
                        flashcards.append({
                            "front": "What is the significance of: " + text[:40] + "...?",
                            "back": text
                        })
    
    # Limit to a reasonable number of flashcards (max 10)
    return flashcards[:10]    

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
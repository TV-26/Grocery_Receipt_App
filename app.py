from flask import Flask, render_template, request, jsonify
import os
import pytesseract
from PIL import Image
from transformers import pipeline

app = Flask(__name__)

# Set up the Hugging Face model for NER
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english", aggregation_strategy="simple")

# Upload folder for receipt images
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/receipts', methods=['POST'])
def upload_receipt():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # Process the receipt with OCR
    extracted_text = pytesseract.image_to_string(Image.open(file_path))
    
    # Use Hugging Face model to extract entities
    entities = ner_pipeline(extracted_text)

    # Extract items and prices from entities (this part can be customized)
    items = []
    for entity in entities:
        if entity['entity_group'] == 'PRODUCT':
            items.append(entity['word'])

    # Mock response; in a real scenario, you'd compute totals from the extracted prices
    mock_total = sum(1.00 for item in items)  # Placeholder total for demonstration

    return jsonify({'extracted_text': extracted_text, 'items': items, 'total': mock_total})

if __name__ == '__main__':
    app.run(debug=True)

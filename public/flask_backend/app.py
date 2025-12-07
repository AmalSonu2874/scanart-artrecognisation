# IKARA Flask Backend
# Deploy this separately to Railway, Render, or your own server
# 
# Requirements:
# pip install flask flask-cors tensorflow pillow numpy
#
# Usage:
# 1. Place ikara_vgg16_model.h5 in the same directory
# 2. Run: python app.py
# 3. Update the frontend API URL to point to this server

"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Model configuration
MODEL_PATH = 'ikara_vgg16_model.h5'
MODEL_VERSION = 'VGG16-IKARA v1.0'
LAST_TRAINED = '2025-01-01'
IMG_SIZE = (224, 224)

# Art style classes (update based on your model's training)
CLASSES = [
    'Gond',
    'Kalighat',
    'Kangra',
    'Kerala Mural',
    'Madhubani',
    'Mandana',
    'Pichwai',
    'Warli'
]

# Load model on startup
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = keras.models.load_model(MODEL_PATH)
        print(f"Model loaded: {MODEL_PATH}")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}")

def preprocess_image(image_bytes):
    '''Preprocess image for VGG16 prediction'''
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize(IMG_SIZE)
    img_array = np.array(img)
    img_array = img_array / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    '''Predict art style from uploaded image'''
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Preprocess
        processed_img = preprocess_image(image_bytes)
        
        # Predict
        predictions = model.predict(processed_img)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        predicted_label = CLASSES[predicted_class_idx]
        
        # All predictions for confidence graph
        all_predictions = [
            {'label': CLASSES[i], 'confidence': float(predictions[0][i])}
            for i in range(len(CLASSES))
        ]
        
        return jsonify({
            'label': predicted_label,
            'confidence': confidence,
            'all_predictions': all_predictions,
            'version': MODEL_VERSION,
            'last_trained': LAST_TRAINED
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    '''Health check endpoint'''
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'version': MODEL_VERSION
    })

@app.route('/info', methods=['GET'])
def info():
    '''Model information endpoint'''
    return jsonify({
        'model': 'VGG16 Transfer Learning',
        'version': MODEL_VERSION,
        'last_trained': LAST_TRAINED,
        'classes': CLASSES,
        'input_size': IMG_SIZE
    })

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000, debug=False)
"""

# Note: This file is a reference for the Flask backend.
# The actual .h5 model file should be deployed with this backend.
# 
# To deploy:
# 1. Create a new repository with this app.py
# 2. Add requirements.txt with: flask, flask-cors, tensorflow, pillow, numpy
# 3. Add the ikara_vgg16_model.h5 file
# 4. Deploy to Railway, Render, or Heroku
# 5. Update the API URL in the React frontend

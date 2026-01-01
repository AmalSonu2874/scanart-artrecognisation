# IKARA Flask Backend with ResNet Model
# Deploy to Railway, Render, or your own server
# 
# This uses the ResNet model for higher accuracy predictions

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import os
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Model configuration - Using ResNet for best accuracy
RESNET_MODEL_PATH = 'ikara_resnet_model.h5'
MOBILENET_MODEL_PATH = 'ikara_mobilenet_model.h5'
MODEL_VERSION = 'ResNet-IKARA v1.0'
LAST_TRAINED = '2025-01-01'
IMG_SIZE = (224, 224)

# Art style classes (must match training order)
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

# Art style descriptions for enhanced responses
ART_DESCRIPTIONS = {
    'Gond': 'This artwork displays the distinctive Gond tribal art style from Madhya Pradesh, characterized by intricate dot and dash patterns filling stylized animal and nature forms with vibrant, contrasting colors.',
    'Kalighat': 'This artwork exemplifies the Kalighat painting tradition from Bengal, featuring bold sweeping brushstrokes, simplified figures with strong outlines, and the characteristic 19th century Bengali artistic style.',
    'Kangra': 'This artwork represents the delicate Kangra miniature painting style from Himachal Pradesh, showcasing soft pastel colors, romantic themes, lush green landscapes, and fine detailed brushwork of the Pahari school.',
    'Kerala Mural': 'This artwork displays the Kerala Mural tradition, featuring bold black outlines, the traditional five-color Panchavarna palette, divine figures with large expressive eyes, and detailed ornamental elements.',
    'Madhubani': 'This artwork showcases the Madhubani painting tradition from Bihar, characterized by double-line borders, dense geometric patterns filling empty spaces, and intricate depictions of nature and mythology.',
    'Mandana': 'This artwork represents Mandana art from Rajasthan, featuring white chalk designs on red ochre backgrounds, geometric borders, and traditional motifs of elephants, peacocks, and festival patterns.',
    'Pichwai': 'This artwork exemplifies the Pichwai tradition from Nathdwara, Rajasthan, featuring devotional themes centered on Lord Krishna, cows, lotus flowers, and rich deep colors in temple art aesthetic.',
    'Warli': 'This artwork displays the Warli tribal art from Maharashtra, characterized by white geometric figures on brown/red earth backgrounds, simple stick figures in daily life scenes, and primitive tribal aesthetic.'
}

# Load models on startup
resnet_model = None
mobilenet_model = None

def load_models():
    global resnet_model, mobilenet_model
    
    # Load ResNet (primary - higher accuracy)
    if os.path.exists(RESNET_MODEL_PATH):
        try:
            resnet_model = keras.models.load_model(RESNET_MODEL_PATH)
            print(f"✓ ResNet model loaded: {RESNET_MODEL_PATH}")
        except Exception as e:
            print(f"✗ Failed to load ResNet: {e}")
    else:
        print(f"⚠ ResNet model not found at {RESNET_MODEL_PATH}")
    
    # Load MobileNet (backup - faster)
    if os.path.exists(MOBILENET_MODEL_PATH):
        try:
            mobilenet_model = keras.models.load_model(MOBILENET_MODEL_PATH)
            print(f"✓ MobileNet model loaded: {MOBILENET_MODEL_PATH}")
        except Exception as e:
            print(f"✗ Failed to load MobileNet: {e}")
    else:
        print(f"⚠ MobileNet model not found at {MOBILENET_MODEL_PATH}")

def preprocess_image(image_bytes):
    """Preprocess image for model prediction"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize(IMG_SIZE)
    img_array = np.array(img)
    img_array = img_array / 255.0  # Normalize to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def decode_base64_image(base64_string):
    """Decode base64 image string"""
    # Remove data URL prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    return base64.b64decode(base64_string)

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Predict art style from uploaded image or base64"""
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    # Use ResNet as primary, fallback to MobileNet
    model = resnet_model if resnet_model is not None else mobilenet_model
    model_name = 'ResNet' if resnet_model is not None else 'MobileNet'
    
    if model is None:
        return jsonify({'error': 'No model loaded. Please ensure model files are present.'}), 500
    
    try:
        image_bytes = None
        
        # Check for file upload
        if 'image' in request.files:
            image_file = request.files['image']
            image_bytes = image_file.read()
        
        # Check for base64 in JSON body
        elif request.is_json:
            data = request.get_json()
            if 'imageBase64' in data:
                image_bytes = decode_base64_image(data['imageBase64'])
            elif 'image' in data:
                image_bytes = decode_base64_image(data['image'])
        
        if image_bytes is None:
            return jsonify({'error': 'No image provided. Send file as "image" or base64 as "imageBase64"'}), 400
        
        # Preprocess and predict
        processed_img = preprocess_image(image_bytes)
        predictions = model.predict(processed_img, verbose=0)
        
        # Get prediction results
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        predicted_label = CLASSES[predicted_class_idx]
        
        # Build all predictions for confidence graph
        all_predictions = [
            {'label': CLASSES[i], 'confidence': float(predictions[0][i])}
            for i in range(len(CLASSES))
        ]
        # Sort by confidence descending
        all_predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Get description
        description = ART_DESCRIPTIONS.get(predicted_label, f'This artwork has been identified as {predicted_label} style.')
        
        return jsonify({
            'label': predicted_label,
            'confidence': confidence,
            'description': description,
            'all_predictions': all_predictions,
            'version': f'{model_name}-IKARA v1.0',
            'model': model_name,
            'timestamp': tf.timestamp().numpy().item() if hasattr(tf, 'timestamp') else None
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'resnet_loaded': resnet_model is not None,
        'mobilenet_loaded': mobilenet_model is not None,
        'version': MODEL_VERSION,
        'classes': CLASSES
    })

@app.route('/info', methods=['GET'])
def info():
    """Model information endpoint"""
    return jsonify({
        'models': {
            'resnet': {
                'loaded': resnet_model is not None,
                'description': 'High accuracy ResNet model for art classification'
            },
            'mobilenet': {
                'loaded': mobilenet_model is not None,
                'description': 'Fast MobileNet model for quick predictions'
            }
        },
        'version': MODEL_VERSION,
        'last_trained': LAST_TRAINED,
        'classes': CLASSES,
        'input_size': IMG_SIZE,
        'primary_model': 'ResNet' if resnet_model else 'MobileNet'
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'name': 'IKARA Art Classification API',
        'version': MODEL_VERSION,
        'endpoints': {
            '/predict': 'POST - Classify an artwork image',
            '/health': 'GET - Check server health',
            '/info': 'GET - Get model information'
        },
        'usage': 'POST to /predict with image file or base64 encoded image'
    })

if __name__ == '__main__':
    load_models()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

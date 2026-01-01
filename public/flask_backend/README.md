# IKARA Flask Backend - ResNet Art Classification

This Flask backend uses trained ResNet and MobileNet models to classify Indian traditional art styles with high accuracy.

## Supported Art Styles
- Gond
- Kalighat  
- Kangra
- Kerala Mural
- Madhubani
- Mandana
- Pichwai
- Warli

## Files Included
- `app.py` - Flask application
- `requirements.txt` - Python dependencies
- `Procfile` - Heroku/Railway process file
- `railway.json` - Railway configuration
- `ikara_resnet_model.h5` - ResNet model (primary, high accuracy)
- `ikara_mobilenet_model.h5` - MobileNet model (backup, faster)

---

## 🚀 Deploy to Railway (Recommended)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New GitHub Repository
Create a new repo with these files from `public/flask_backend/`:
- `app.py`
- `requirements.txt`
- `Procfile`
- `railway.json`
- `ikara_resnet_model.h5`
- `ikara_mobilenet_model.h5`

### Step 3: Deploy on Railway
1. In Railway, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your new repository
4. Railway will auto-detect Python and deploy

### Step 4: Get Your API URL
After deployment (~2-5 minutes), Railway provides a URL like:
```
https://your-app-name.up.railway.app
```

### Step 5: Test Your Deployment
```bash
# Health check
curl https://your-app-name.up.railway.app/health

# Test prediction
curl -X POST https://your-app-name.up.railway.app/predict \
  -F "image=@your-artwork.jpg"
```

---

## API Endpoints

### POST /predict
Classify an artwork image.

**File Upload:**
```bash
curl -X POST -F "image=@artwork.jpg" https://your-app.up.railway.app/predict
```

**Base64 JSON:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"imageBase64": "data:image/jpeg;base64,..."}' \
  https://your-app.up.railway.app/predict
```

**Response:**
```json
{
  "label": "Madhubani",
  "confidence": 0.95,
  "description": "This artwork showcases the Madhubani painting tradition from Bihar...",
  "all_predictions": [
    {"label": "Madhubani", "confidence": 0.95},
    {"label": "Gond", "confidence": 0.03},
    {"label": "Warli", "confidence": 0.01},
    ...
  ],
  "version": "ResNet-IKARA v1.0",
  "model": "ResNet"
}
```

### GET /health
Check server status and model loading.

### GET /info
Get detailed model information.

### GET /
API documentation.

---

## Local Development

```bash
cd public/flask_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py

# Server runs at http://localhost:5000
```

---

## Connecting to IKARA Frontend

Once deployed, you can optionally configure the frontend to use your custom model backend by creating an edge function that calls your Railway URL instead of the AI gateway.

---

## Model Information

| Model | Accuracy | Speed | Use Case |
|-------|----------|-------|----------|
| ResNet | Higher | Slower | Production analysis |
| MobileNet | Good | Faster | Quick predictions |

- **Input Size**: 224x224 pixels
- **Output**: 8 art style classes with confidence scores
- **Primary**: ResNet (automatically used if available)
- **Fallback**: MobileNet (used if ResNet unavailable)

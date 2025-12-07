# IKARA Flask Backend

This is the optional Flask backend for running the custom VGG16 model. 

**Note:** The main IKARA app now uses Lovable AI with vision capabilities, so this backend is only needed if you want to use your custom-trained model.

## Quick Deploy to Railway

1. Create a new Railway project
2. Connect your GitHub repo (or upload these files)
3. Add the `ikara_vgg16_model.h5` file
4. Railway will auto-detect the Dockerfile and deploy

## Quick Deploy to Render

1. Create a new Web Service on Render
2. Connect your repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn --bind 0.0.0.0:$PORT --timeout 120 app:app`

## Files Required

- `app.py` - Flask application
- `requirements.txt` - Python dependencies
- `Dockerfile` - Container configuration
- `ikara_vgg16_model.h5` - Your trained Keras model
- `railway.json` - Railway-specific config (optional)

## API Endpoints

- `POST /predict` - Analyze artwork image
- `GET /health` - Health check
- `GET /info` - Model information

## Local Development

```bash
pip install -r requirements.txt
python app.py
```

Server runs at http://localhost:5000

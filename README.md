# ar-business-card-scanner
# 📇 AR Business Card Scanner & AI Avatar

## 🚀 Features
- 📸 Capture business card using webcam
- 🧠 Extract text using OCR (Tesseract)
- 🧑‍💻 Render a 3D avatar (A-Frame)
- 🗣️ Make the avatar speak the extracted text

## 📥 Setup Instructions
1. **Clone the repo**
```bash
git clone https://github.com/yourusername/ar-business-card-scanner.git
cd ar-business-card-scanner
```

2. **Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

3. **Run Flask backend**
```bash
python app.py
```

4. **Frontend**

```bash
cd frontend
python -m http.server 8000
```

# Troubleshoot
## Sound
If you are not able to get a speech output, please check your permissions in
chrome://settings/content/sound
to make sure you have sound permissions open for the site. 

## Camera
Make sure your camera is clean, and if needed make the business card words bigger or bolder so it is easier for the program to pull the letters. 
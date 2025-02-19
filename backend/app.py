## 📁 backend/app.py
from flask import Flask, request, jsonify
import cv2
import pytesseract
import numpy as np
import base64

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    data = request.get_json()
    img_data = base64.b64decode(data['image'])
    np_img = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    text = pytesseract.image_to_string(thresh)
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)
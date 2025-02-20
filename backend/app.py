import cv2
import pytesseract
import numpy as np
from flask import Flask, request, jsonify
import base64

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
@app.route('/ocr', methods=['POST'])
def ocr():
    data = request.get_json()
    img_data = base64.b64decode(data['image'])
    np_img = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply thresholding
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Resize image to help Tesseract (if it's too small)
    scale_percent = 150  # scale by 150%
    width = int(thresh.shape[1] * scale_percent / 100)
    height = int(thresh.shape[0] * scale_percent / 100)
    resized = cv2.resize(thresh, (width, height), interpolation=cv2.INTER_LINEAR)

    # OCR
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(resized, config=custom_config)
    return jsonify({'text': text})


if __name__ == '__main__':
    app.run(debug=True)

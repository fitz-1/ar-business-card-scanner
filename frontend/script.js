navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => document.getElementById('video').srcObject = stream);

function captureImage() {
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL('image/png').split(',')[1];

    fetch('http://127.0.0.1:5000/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Extracted Text:", data.text);
        speakText(data.text);
    });
}

function speakText(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
}
// ✅ Ensure DOM is loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

    // 🎥 Access Video Stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            document.getElementById('video').srcObject = stream;
        })
        .catch((err) => console.error("Camera Error: ", err));

    // 🎯 Capture Button Logic
    document.getElementById('captureButton').addEventListener('click', () => {
        console.log("🔍 Capture button clicked!");

        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        // 📸 Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 🟢 Perform OCR using Tesseract.js
        Tesseract.recognize(
            canvas,            // Source image
            'eng',             // Language
            { logger: m => console.log(m) } // OCR Progress
        ).then(({ data: { text } }) => {
            console.log("📝 Extracted Text:", text);

            // 🔠 Filter only alphabetic characters (A-Z, a-z)
            text = text.replace(/[^a-zA-Z\s]/g, '');

            // ✅ Safely update ocrResult div if it exists
            const ocrResultDiv = document.getElementById('ocrResult');
            if (ocrResultDiv) {
                ocrResultDiv.innerHTML = `<strong>Extracted Text:</strong><br>${text}`;
            } else {
                console.error("❌ 'ocrResult' div not found.");
            }

            // 🎉 Show Avatar only if "Fitz" or "Fits" is detected
            const avatarBox = document.getElementById('avatarBox');
            if (/\b(Fitz|Fits)\b/i.test(text)) { // Case-insensitive match
                avatarBox.setAttribute('visible', 'true'); // 👀 Show 3D object
                console.log("✅ Business card detected with 'Fitz' or 'Fits'. Avatar displayed.");
            } else {
                avatarBox.setAttribute('visible', 'false'); // ❌ Hide avatar
                console.log("❌ Required text not detected.");
            }
        }).catch((err) => {
            console.error("❌ OCR Error:", err);
        });
    });

});

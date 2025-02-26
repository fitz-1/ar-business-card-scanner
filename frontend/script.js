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
            const model = document.getElementById('fitzEntity').components['gltf-model'];
            console.log("Available animations:", model);

            // 🎉 Show Avatar only if "Fitz" or "Fits" is detected
            const fitzEntity = document.getElementById('fitzEntity');
            const fitzInfo = document.getElementById('fitzIconContainer');
            if (/\b(Fitz|Fits)\b/i.test(text)) { // Case-insensitive match
                fitzEntity.setAttribute('visible', 'true'); // 👀 Show 3D object
                fitzInfo.setAttribute('visible', 'true'); // 👀 Show 3D object
                
                // Call the speech function
                speakWelcomeMessage();
                
                // Keep your existing animation code
                fitzEntity.setAttribute('animation-mixer', {
                    loop: 'repeat',
                    repetitions: 5,
                    timeScale: 1
                });
                console.log("Animation started");
                updateFloatingText(text);
            } else {
                fitzEntity.setAttribute('visible', 'false'); // ❌ Hide avatar
                fitzInfo.setAttribute('visible', 'false'); // ❌ Hide avatar
                // Stop animation
                fitzEntity.removeAttribute('animation-mixer');
                console.log("❌ Required text not detected.");
            }
        }).catch((err) => {
            console.error("❌ OCR Error:", err);
        });
    });

    // Add this after your document.addEventListener("DOMContentLoaded"...
    fitzEntity.addEventListener('model-loaded', function(e) {
        console.log('Model loaded!');
        const mesh = fitzEntity.getObject3D('mesh');
        if (mesh) {
            // Log the entire mesh object to inspect its properties
            console.log('Mesh:', mesh);
            if (mesh.animations) {
                console.log('Animations found:', mesh.animations.length);
                mesh.animations.forEach((anim, index) => {
                    console.log(`Animation ${index}:`, anim.name);
                });
            } else {
                console.warn('No animations found in the model');
            }
        }
    });

    // Add this after model loading
    fitzEntity.addEventListener('animation-loop', function() {
        console.log('Animation completed a loop');
    });

    fitzEntity.addEventListener('animation-finished', function() {
        console.log('Animation finished');
    });

    // Add error handling
    fitzEntity.addEventListener('model-error', function(e) {
        console.error('Error loading model:', e);
    });

    // Add this near your other event listeners
    window.speechSynthesis.addEventListener('error', function(event) {
        console.error('Speech synthesis error:', event);
    });

});

// Add this function at the top level of your script
function speakWelcomeMessage(name) {
    // Create speech synthesis instance
    const speech = new SpeechSynthesisUtterance();
    const messages = [
        `Hello! I am Fitz, welcome to my business card!`,
        `Nice to meet you! I'm Fitz, and I'll be your virtual assistant today.`,
        `Welcome! I'm your digital avatar, Fitz.`
    ];
    
    speech.text = messages[Math.floor(Math.random() * messages.length)];
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    
    // Stop any existing speech
    window.speechSynthesis.cancel();
    // Speak the new message
    window.speechSynthesis.speak(speech);
}

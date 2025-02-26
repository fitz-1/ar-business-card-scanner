// Add this before your DOMContentLoaded event
function updateFloatingText(text) {
    console.log("Updating floating text with:", text);
    const scene = document.querySelector('a-scene');
    
    // Remove any existing floating text
    const oldTexts = document.querySelectorAll('.floating-text');
    oldTexts.forEach(text => text.parentNode.removeChild(text));
    
    // Add new text
    const textEntity = document.createElement('a-text');
    textEntity.setAttribute('class', 'floating-text');
    textEntity.setAttribute('value', text);
    textEntity.setAttribute('position', '0 2.5 -3');
    textEntity.setAttribute('color', '#FFFFFF');
    textEntity.setAttribute('align', 'center');
    scene.appendChild(textEntity);
}

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
                
                // Make sure resume is visible
                const resumeImage = document.querySelector('#resumeImage');
                if (resumeImage) {
                    resumeImage.setAttribute('visible', 'true');
                    // Add a nice fade-in effect
                    resumeImage.setAttribute('animation__fade', {
                        property: 'opacity',
                        from: 0,
                        to: 1,
                        dur: 1000
                    });
                }
                
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
                
                // Hide resume
                const resumeImage = document.querySelector('#resumeImage');
                if (resumeImage) {
                    resumeImage.setAttribute('visible', 'false');
                }
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

    // Add inside your DOMContentLoaded event
    document.getElementById('testSpeech')?.addEventListener('click', () => {
        console.log("Testing speech synthesis...");
        speakWelcomeMessage();
    });

    // Add this inside your DOMContentLoaded event
    document.querySelector('#resumeImage').addEventListener('click', function(evt) {
        evt.preventDefault();
        openResume();
    });

});

// Add this function at the top level of your script
function speakWelcomeMessage(name) {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.error("❌ Speech synthesis not supported");
        return;
    }

    // Request permission if needed (Chrome requirement)
    if (document.visibilityState !== 'visible') {
        console.warn("⚠️ Page must be visible to use speech synthesis");
        return;
    }

    try {
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
        speech.lang = 'en-US';  // Explicitly set language

        // Add event listeners for debugging
        speech.onstart = () => console.log("🗣️ Speech started");
        speech.onend = () => console.log("✅ Speech ended");
        speech.onerror = (event) => console.error("❌ Speech error:", event);
        
        // Stop any existing speech
        window.speechSynthesis.cancel();
        
        // Speak the new message
        window.speechSynthesis.speak(speech);
        
    } catch (error) {
        console.error("❌ Speech synthesis error:", error);
    }
}

// Add this function at the top level of your script
function openResume() {
    // Update this path to match your actual PDF resume location
    const resumePath = '../resources/resume/FITZ-RESUME.pdf';
    window.open(resumePath, '_blank');
}

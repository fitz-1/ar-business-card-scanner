// Define URLs at the top level
const URLS = {
    fitz: {
        resume: '../resources/resume/FITZ-RESUME.pdf',
        portfolio: 'https://www.linkedin.com/in/william-fitzgerald-cu-boulder/',
        project: 'https://www.instagram.com/fits._by_.fitz/'
    },
    sena: {
        resume: '../resources/resume/SENA-RESUME.pdf',
        portfolio: 'https://senas.me',
        project: 'https://github.com/suctuk/'
    }
};

// Handle clicks for Sena's content
function handleSenaClicks(type) {
    console.log(`Opening Sena's ${type}:`, URLS.sena[type]);
    window.open(URLS.sena[type], '_blank');
}

// Handle clicks for Fitz's content
function handleFitzClicks(type) {
    console.log(`Opening Fitz's ${type}:`, URLS.fitz[type]);
    window.open(URLS.fitz[type], '_blank');
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
            canvas,
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log("📝 Extracted Text:", text);
            text = text.replace(/[^a-zA-Z\s]/g, '');

            const fitzEntity = document.getElementById('fitzEntity');
            const fitzInfo = document.getElementById('fitzIconContainer');
            const senaEntity = document.getElementById('senaEntity');
            const senaInfo = document.getElementById('senaIconContainer');

            // Hide all entities first
            fitzEntity.setAttribute('visible', 'false');
            fitzInfo.setAttribute('visible', 'false');
            senaEntity.setAttribute('visible', 'false');
            senaInfo.setAttribute('visible', 'false');

            if (/\b(Fitz|Fits)\b/i.test(text)) {
                // Existing Fitz logic
                fitzEntity.setAttribute('visible', 'true');
                fitzInfo.setAttribute('visible', 'true');
                speakWelcomeMessage();
                fitzEntity.setAttribute('animation-mixer', {
                    loop: 'repeat',
                    repetitions: 5,
                    timeScale: 1
                });
            } else if (/\b(Sena)\b/i.test(text)) {
                // Sena logic
                senaEntity.setAttribute('visible', 'true');
                senaInfo.setAttribute('visible', 'true');
                speakSenaWelcomeMessage();
                senaEntity.setAttribute('animation-mixer', {
                    loop: 'repeat',
                    repetitions: 5,
                    timeScale: 1
                });
            }
        }).catch((err) => {
            console.error("❌ OCR Error:", err);
        });
    });

    // Add this after your document.addEventListener("DOMContentLoaded"...
    const fitzEntity = document.getElementById('fitzEntity');
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

    // FITZ CLICK HANDLERS
    // Set up handlers for Fitz's content
    document.querySelector('#resumeImage')?.addEventListener('click', function(evt) {
        evt.preventDefault();
        handleFitzClicks('resume');
    });

    document.querySelector('#pantsImage')?.addEventListener('click', function(evt) {
        evt.preventDefault();
        handleFitzClicks('project');
    });

    document.querySelector('#bikeImg')?.addEventListener('click', function(evt) {
        evt.preventDefault();
        handleFitzClicks('portfolio');
    });

    // SENA MODEL LOADING
    // Add inside your DOMContentLoaded event
    const senaEntity = document.getElementById('senaEntity');
    senaEntity.addEventListener('model-loaded', function(e) {
        console.log('Sena Model loaded!');
        const mesh = senaEntity.getObject3D('mesh');
        if (mesh && mesh.animations) {
            console.log('Sena Animations found:', mesh.animations.length);
            mesh.animations.forEach((anim, index) => {
                console.log(`Sena Animation ${index}:`, anim.name);
            });
        }
    });

    // SENA CLICK HANDLERS
    // Set up click handlers for Sena's content
    document.querySelector('#senaResumeImage')?.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Sena Resume clicked'); // Debug log
        handleSenaClicks('resume');
    });

    document.querySelector('#senaProjectImage')?.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Sena Project clicked'); // Debug log
        handleSenaClicks('project');
    });

    document.querySelector('#senaPortfolioImg')?.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Sena Portfolio clicked'); // Debug log
        handleSenaClicks('portfolio');
    });
});

// Add this function at the top level of your script
function speakWelcomeMessage() {
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
            `Nice to meet you! I'm Fitz, here is what I do!`,
            `Welcome! I'm your digital avatar, Fitz. Take a look at my work!`
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
function speakSenaWelcomeMessage() {
    if (!('speechSynthesis' in window)) {
        console.error("❌ Speech synthesis not supported");
        return;
    }

    try {
        const speech = new SpeechSynthesisUtterance();
        const messages = [
            `Hello! I am Sehna, welcome to my business card!`,
            `Nice to meet you! I'm Sehna, here is what I do!`,
            `Welcome! I'm your digital avatar, Sehna. Take a look at my work!`
        ];
        
        speech.text = messages[Math.floor(Math.random() * messages.length)];
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        speech.lang = 'en-US';

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
        
    } catch (error) {
        console.error("❌ Speech synthesis error:", error);
    }
}

// REMOVE THESE REDUNDANT FUNCTIONS - They're replaced by handleSenaClicks and handleFitzClicks
// These older functions are no longer needed and are causing the issues:
// openResume, openInsta, openLinked, openSenaResume, openSenaProject, openSenaPortfolio
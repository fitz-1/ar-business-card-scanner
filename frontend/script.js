// Define URLs at the top level
const URLS = {
    fitz: {
        resume: '../resources/resume/FITZ-RESUME.pdf',
        portfolio: 'https://fitzs-portfolio-url.com',
        project: 'https://github.com/fitzs-project'
    },
    sena: {
        resume: '../resources/resume/SENA-RESUME.pdf',
        portfolio: 'https://www.linkedin.com/in/sena-tuk/',
        project: 'https://github.com/suctuk/'
    }
};

// Handle clicks for Sena's content
function handleSenaClicks(type) {
    console.log(`Opening Sena's ${type}:`, URLS.sena[type]);
    window.open(URLS.sena[type], '_blank');
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
            // Only keep letters and spaces, remove all other characters including numbers
            const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
            console.log("📝 Extracted Text:", cleanedText);

            const fitzEntity = document.getElementById('fitzEntity');
            const fitzInfo = document.getElementById('fitzIconContainer');
            const senaEntity = document.getElementById('senaEntity');
            const senaInfo = document.getElementById('senaIconContainer');

            // Hide all entities first
            fitzEntity.setAttribute('visible', 'false');
            fitzInfo.setAttribute('visible', 'false');
            senaEntity.setAttribute('visible', 'false');
            senaInfo.setAttribute('visible', 'false');

            // Use cleanedText instead of text in your conditions
            if (/\b(Fitz|Fits|Flts|Fltz)\b/i.test(cleanedText)) {
                // Existing Fitz logic
                fitzEntity.setAttribute('visible', 'true');
                fitzInfo.setAttribute('visible', 'true');
                speakWelcomeMessage();
                fitzEntity.setAttribute('animation-mixer', {
                    loop: 'repeat',
                    repetitions: 5,
                    timeScale: 1
                });
            } else if (/\b(Sena|Uctuk)\b/i.test(cleanedText)) {
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

    // Add this inside your DOMContentLoaded event
    document.querySelector('#instaImage').addEventListener('click', function(evt) {
        evt.preventDefault();
        openInsta();
    });

    // Add this inside your DOMContentLoaded event
    document.querySelector('#bikeImg').addEventListener('click', function(evt) {
        evt.preventDefault();
        openLinked();
    });

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

    // Add click listeners for Sena's icons
    document.querySelector('#senaResumeImage')?.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Sena Resume clicked'); // Debug log
        openSenaResume();
    });

    document.querySelector('#senaProjectImage')?.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Sena Project clicked'); // Debug log
        openSenaProject();
    });

    document.querySelector('#senaPortfolioImg')?.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Sena Portfolio clicked'); // Debug log
        openSenaPortfolio();
    });

    // Add click handlers for Sena's content
    const senaClickHandlers = {
        'senaResumeImage': () => handleSenaClicks('resume'),
        'senaProjectImage': () => handleSenaClicks('project'),
        'senaPortfolioImg': () => handleSenaClicks('portfolio')
    };

    // Attach click handlers after DOM is loaded
    Object.entries(senaClickHandlers).forEach(([id, handler]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (evt) => {
                evt.preventDefault();
                handler();
            });
        }
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
function openResume() {
    // Update this path to match your actual PDF resume location
    const resumePath = '../resources/resume/FITZ-RESUME.pdf';
    window.open(resumePath, '_blank');
}
// Add this function at the top level of your script
function openInsta() {
    // instagram path
    const instaPath = 'https://www.instagram.com/fits._by_.fitz/';
    window.open(instaPath, '_blank');
}

function openLinked() {
    // instagram path
    const linkedPath = 'https://www.linkedin.com/in/william-fitzgerald-cu-boulder/';
    window.open(linkedPath, '_blank');
}

// Add these functions at the top level of your script
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

function openSenaResume() {
    const senaResumePath = '../resources/resume/SENA-RESUME.pdf'; // Make sure this matches your actual file name
    window.open(senaResumePath, '_blank');
    console.log("Opening Sena's Resume:", senaResumePath);
}

function openSenaProject() {
    const senaProjectURL = 'https://github.com/suctuk/';
    window.open(senaProjectURL, '_blank');
    console.log("Opening Sena's Project:", senaProjectURL);
}

function openSenaPortfolio() {
    const senaPortfolioURL = 'https://senas.me'; // Replace with Sena's actual LinkedIn
    window.open(senaPortfolioURL, '_blank');
    console.log("Opening Sena's Portfolio:", senaPortfolioURL);
}

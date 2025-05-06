// Wait for Face-API models to load
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startCamera);

// Start student webcam stream
async function startCamera() {
    const video = document.getElementById("studentVideo");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        detectEmotions(video);
    } catch (error) {
        console.error("Error accessing webcam: ", error);
    }
}

// Function to detect student's emotion
async function detectEmotions(video) {
    const emotionDisplay = document.getElementById("emotion");
    const feedbackText = document.getElementById("feedbackText");

    setInterval(async () => {
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        if (detections) {
            // Get detected emotion
            const expressions = detections.expressions;
            const detectedEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            emotionDisplay.textContent = detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1);

            // Compare with the target emotion
            checkMatch(detectedEmotion);
        }
    }, 500);
}

// Function to check if student's expression matches the instructional video
function checkMatch(detectedEmotion) {
    const targetEmotion = document.getElementById("targetEmotion").textContent.toLowerCase();
    const feedbackText = document.getElementById("feedbackText");

    if (detectedEmotion === targetEmotion) {
        feedbackText.textContent = "✅ Great! Your expression matches!";
        feedbackText.style.color = "green";
    } else {
        feedbackText.textContent = "❌ Try again! Match the target emotion.";
        feedbackText.style.color = "red";
    }
}

// Simulate target emotion updates from instructional video (Can be integrated with AI)
const emotionsList = ["Happy", "Sad", "Surprised", "Angry", "Neutral"];
setInterval(() => {
    const randomEmotion = emotionsList[Math.floor(Math.random() * emotionsList.length)];
    document.getElementById("targetEmotion").textContent = randomEmotion;
}, 7000); // Change target emotion every 7 seconds

const video = document.getElementById('studentVideo');
const emotionDiv = document.getElementById('emotion');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

studentVideo.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const emotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
      emotionDiv.innerHTML = emotion.toUpperCase();
    }
  }, 100);
});


document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("emotionChart").getContext("2d");
  const emotionHistory = [];
  const timeLabels = [];

  const emotionChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: timeLabels,
          datasets: [{
              label: "Emotion Trends",
              data: emotionHistory,
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              fill: true
          }]
      },
      options: {
          scales: {
              x: { title: { display: true, text: "Time" } },
              y: { title: { display: true, text: "Emotion Score" }, min: 0, max: 1 }
          }
      }
  });

  function updateEmotionHistory(emotion) {
      const timestamp = new Date().toLocaleTimeString();
      timeLabels.push(timestamp);
      emotionHistory.push(mapEmotionToScore(emotion));

      if (timeLabels.length > 10) {  // Limit history to 10 points
          timeLabels.shift();
          emotionHistory.shift();
      }

      emotionChart.update();
  }

  function mapEmotionToScore(emotion) {
      const scores = { "Happy": 1, "Neutral": 0.5, "Sad": 0, "Angry": 0.2, "Surprised": 0.8 };
      return scores[emotion] || 0.5;  // Default to neutral
  }

  function detectEmotion() {
      const emotions = ["Happy", "Sad", "Angry", "Neutral", "Surprised"];
      const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];

      document.getElementById("emotion").textContent = detectedEmotion;
      updateEmotionHistory(detectedEmotion);
  }

  setInterval(detectEmotion, 2000); // Update every 2 seconds
});



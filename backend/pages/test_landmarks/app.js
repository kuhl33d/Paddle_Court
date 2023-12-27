const video = document.getElementById('video');
const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// get cam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing webcam:', error);
    });

// handle file
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    processImage(file);
});

// capturing webcam
video.addEventListener('canplay', () => {
    setInterval(() => {
        captureFrame();
    }, 1000); // adjust it for high speed
});

function captureFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    const blobData = dataURItoBlob(imageData);
    processImage(blobData);
}

function processImage(image) {
    const formData = new FormData();
    formData.append('image', image);

    fetch('http://localhost:5000/detect_hand', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        // process results
        drawLandmarks(result.landmarks);
    })
    .catch(error => console.error('Error:', error));
}

function drawLandmarks(landmarks) {
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // landmarks on canvas
    ctx.fillStyle = 'red';
    for (const point of landmarks) {
        ctx.beginPath();
        ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

import React, { useState, useRef } from "react";

export default function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [imageDataURL, setImageDataURL] = useState("");
  const [stream, setStream] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Start camera and continuous capture
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setMessage("Camera started.");

      // Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => console.error("Error getting location:", err)
        );
      }

      // Start capturing every 5 seconds
      const id = setInterval(capturePhoto, 5000);
      setIntervalId(id);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setMessage("Cannot access camera.");
    }
  };

  // Stop camera and interval
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setMessage("Camera stopped.");
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");
    setImageDataURL(dataURL);

    sendToBackend(dataURL);
  };

  // Send photo to backend
  const sendToBackend = async (dataURL) => {
    try {
      setStatus("uploading");

      const res = await fetch(dataURL);
      const blob = await res.blob();

      const formData = new FormData();
      const uniqueFilename = `capture_${Date.now()}.png`;
      formData.append("file", blob, uniqueFilename);
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);

      const response = await fetch("http://127.0.0.1:5000/identify-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus("success");

        if (data.results && data.results.length > 0) {
          const names = data.results.map(
            (r) => r.person !== "unknown" ? r.person : "Unknown"
          );
          setMessage(`Recognized: ${names.join(", ")}`);
        } else {
          setMessage("No face recognized.");
        }
      } else {
        setStatus("error");
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("An error occurred.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Camera Capture</h2>

      <div style={{marginTop:30}}>
        <button onClick={startCamera} className="upload-btn" style={{marginRight : 20}}>
          Start
        </button>
        <button onClick={stopCamera} className="upload-btn">Stop</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <video ref={videoRef} autoPlay style={{ width: "300px", borderRadius: "8px" }}></video>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>

      {imageDataURL && (
        <div style={{ marginTop: "20px" }}>
          <h3>Captured Image:</h3>
          <img src={imageDataURL} alt="captured" style={{ width: "150px", borderRadius: "8px" }} />
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

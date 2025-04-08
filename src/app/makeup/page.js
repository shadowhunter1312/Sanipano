"use client";
import { useRef, useState } from "react";

export default function CameraApp() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState("");
    const [resultImage, setResultImage] = useState("");

    async function requestCameraAccess() {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera Error:", err);
            setError(`${err.name}: ${err.message}`);
        }
    }

    async function captureAndSend() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // Draw the current frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const imageBase64 = canvas.toDataURL("image/jpeg");

        // Send to backend
        const res = await fetch("http://127.0.0.1:8000/lipstick", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageBase64 }),
        });

        const data = await res.json();
        setResultImage(data.image); // base64 with lipstick
    }

    return (
        <div>
            <h2>💄 Makeup App</h2>
            <button onClick={requestCameraAccess}>🎥 Allow Camera</button>
            <button onClick={captureAndSend}>💋 Apply Lipstick</button>

            <video ref={videoRef} autoPlay playsInline width="640" height="480" />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {resultImage && (
                <div>
                    <h3>👄 Processed Image:</h3>
                    <img src={resultImage} alt="Lipstick Applied" width="640" />
                </div>
            )}

            {error && <p style={{ color: "red" }}>❌ {error}</p>}
        </div>
    );
}

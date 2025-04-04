"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraApp() {
    const videoRef = useRef(null);
    const [error, setError] = useState("");

    async function requestCameraAccess() {
        setError(""); // Reset errors before trying again

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("❌ Camera access is not supported in this browser.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("❌ Camera Error:", err.name, err.message);
            setError(`${err.name}: ${err.message}`);
        }
    }

    return (
        <div>
            <h2>📷 Camera Access</h2>
            <button onClick={requestCameraAccess}>🎥 Allow Camera</button>
            <video ref={videoRef} autoPlay playsInline width="640" height="480" />
            {error && <p style={{ color: "red" }}>❌ {error}</p>}
        </div>
    );
}

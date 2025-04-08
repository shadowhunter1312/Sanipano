from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import mediapipe as mp
import io
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True)

@app.post("/apply-makeup")
async def apply_makeup(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert to RGB
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb)

    if result.multi_face_landmarks:
        for face_landmarks in result.multi_face_landmarks:
            lips_indices = list(set(mp_face_mesh.FACEMESH_LIPS))
            for (i, j) in lips_indices:
                x1, y1 = int(face_landmarks.landmark[i].x * image.shape[1]), int(face_landmarks.landmark[i].y * image.shape[0])
                x2, y2 = int(face_landmarks.landmark[j].x * image.shape[1]), int(face_landmarks.landmark[j].y * image.shape[0])
                cv2.line(image, (x1, y1), (x2, y2), (0, 0, 255), 2)

    _, buffer = cv2.imencode('.jpg', image)
    return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")

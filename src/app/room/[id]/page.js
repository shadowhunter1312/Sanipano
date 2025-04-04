"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import PanoramaScene from "../../components/view";
import Sidebar from "../../components/sidebar";
import data from '../../lib/data.json'

export default function RoomView() {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();
  const [room, setRoom] = useState(null);
  const [skyboxImages, setSkyboxImages] = useState([]);

  useEffect(() => {

        if (data[roomId]) {
          setRoom(data[roomId]);
          setSkyboxImages(data[roomId].images);
        }
  
  }, [roomId]);

  const updateSkyboxFace = (newTexture) => {
    if (!room) return;
    const updatedImages = [...skyboxImages];
    updatedImages[room.changeableFace] = newTexture;
    setSkyboxImages(updatedImages);
  };

  if (!room) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar products={room.products} onTextureChange={updateSkyboxFace} />
      <PanoramaScene cubeImages={skyboxImages} />
    </div>
  );
}

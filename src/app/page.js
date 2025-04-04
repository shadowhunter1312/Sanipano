"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import data from './lib/data.json'
import Image from "next/image";
export default function SelectRoom() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setRooms(Object.entries(data))
  }, []);

  const selectRoom = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="container">
    <h1 className="title">Select a Room</h1>
    <div className="list">
      {rooms.map(([roomId, room]) => (
        <div key={roomId} className="room-item" onClick={() => selectRoom(roomId)}>
          <Image src={room.thumbnail} alt={room.name} className="room-image" width={400} height={400} />
          <p className="room-name">{room.name}</p>
        </div>
      ))}
    </div>

    <style jsx>{`
      .container {
        text-align: center;
        padding: 20px;
        max-width: 1200px;
        margin: auto;
      }
      .title {
        font-size: 2rem;
        margin-bottom: 20px;
      }
      .list {
        display: flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;
      }
      .room-item {
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 10px;
        overflow: hidden;
      }
      .room-item:hover {
        transform: scale(1.02);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
      .room-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 8px;
      }
      .room-name {
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 10px;
      }
    `}</style>
  </div>
  );
}

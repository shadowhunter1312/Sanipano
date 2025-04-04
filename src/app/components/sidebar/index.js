"use client";
import Image from "next/image";

export default function Sidebar({ products, onTextureChange }) {
  return (
    <div style={{ width: "150px", height: "100vh", background: "#ddd", padding: "10px", overflowY: "auto" }}>
      <h2>Available Product</h2>
      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "10px" }}>
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={100}
            height={100}
            style={{cursor: "pointer" }}
            onClick={() => onTextureChange(product.pimage)}
          />
          <p>{product.name}</p>
        </div>
      ))}
    </div>
  );
}

//src/components/Canvas/Canvas.jsx
import React, { useRef, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Initial canvas setup
    ctx.fillStyle = "#f5f5f5"; // neutral background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}   // default, will later use dynamic size
      height={600}  // default, from Canvas Selection
      style={{ flex: 1, border: "1px solid #ccc" }}
    />
  );
};

export default Canvas;
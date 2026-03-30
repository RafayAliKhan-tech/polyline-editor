// src/views/Renderer2D.jsx
import React, { useEffect } from "react";

const Renderer2D = ({
  canvasRef,
  polylines,
  selectedVertexId,
  selectedVertices,
  mode,
  zoom,
  offset,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // ===== HIGH DPI FIX (FOR SHARP LINES) =====
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();

    // Set display size
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // Set actual drawing surface size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    // ===== CLEAR CANVAS =====
    ctx.clearRect(0, 0, width, height);

    ctx.save();

    // ===== PAN + ZOOM =====
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // ================= GRID (MATCHING IMAGE STYLE) =================
    const gridSize = 50;
    const subGridSize = 10;

    const startX = Math.floor(-offset.x / zoom / gridSize) * gridSize - gridSize;
    const startY = Math.floor(-offset.y / zoom / gridSize) * gridSize - gridSize;
    const endX = startX + width / zoom + gridSize * 2;
    const endY = startY + height / zoom + gridSize * 2;

    // Minor Grid (Very subtle lines)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"; 
    ctx.lineWidth = 0.5 / zoom;

    for (let x = startX; x <= endX; x += subGridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += subGridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // Major Grid (Slightly more visible)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1 / zoom;

    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // ================= DRAW POLYLINES =================
    polylines.forEach((poly) => {
      const verts = poly.getVertices();
      if (!verts.length) return;

      const lineColor = verts[0].color || "#4ade80";

      // Draw Lines
      ctx.beginPath();
      verts.forEach((v, i) => {
        i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y);
      });

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2 / zoom;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw Vertices
      verts.forEach((v) => {
        ctx.beginPath();
        const radius = 4 / zoom;
        ctx.arc(v.x, v.y, radius, 0, Math.PI * 2);

        const isSelected = selectedVertices?.some((s) => s.id === v.id);
        const isActive = v.id === selectedVertexId;

        if (isSelected) {
          ctx.fillStyle = "#f472b6"; 
        } else if (isActive) {
          ctx.fillStyle = "#ef4444"; 
        } else {
          ctx.fillStyle = v.color || "#ffffff"; 
        }

        ctx.fill();

        // Small stroke for vertices to make them pop
        ctx.strokeStyle = "#1a1b1e";
        ctx.lineWidth = 1 / zoom;
        ctx.stroke();
      });
    });

    ctx.restore();
  }, [polylines, selectedVertexId, selectedVertices, zoom, offset]);

  // ===== DYNAMIC CURSOR =====
  const getCursor = () => {
    switch (mode) {
      case "PAN": return "grab";
      case "MOVE": return "move";
      case "DELETE": return "not-allowed";
      case "SELECT": return "default";
      default: return "crosshair";
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",      // Container ka full width lega
        height: "100%",     // Container ka full height lega
        background: "#1a1b1e", // Professional Dark Theme
        display: "block",
        cursor: getCursor(),
      }}
    />
  );
};

export default Renderer2D;
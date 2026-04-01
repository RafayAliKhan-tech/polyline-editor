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
  showGrid,
  backgroundColor = "#0a0f1a",
  gridColor = "#4ade80",

  // 🔥 NEW PROPS
  strokeWidth = 2,
  opacity = 100
}) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ BACKGROUND
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ✅ GRID
    if (showGrid) {
      drawGrid(ctx, width, height, zoom, offset, gridColor);
    }

    // ✅ TRANSFORM
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // 🔥 APPLY OPACITY
    ctx.globalAlpha = opacity / 100;

    // ✅ DRAW POLYLINES
    polylines.forEach((poly) => {
      const verts = poly.getVertices();
      if (!verts.length) return;

      const lineColor = verts[0]?.color || "#ffffff";

      // 🔹 LINES
      ctx.beginPath();
      verts.forEach((v, i) => {
        if (i === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });

      ctx.strokeStyle = lineColor;

      // 🔥 STROKE WIDTH FIX
      ctx.lineWidth = strokeWidth / zoom;

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // 🔹 VERTICES
      verts.forEach((v) => {
        ctx.beginPath();

        const radius = 4 / zoom;
        ctx.arc(v.x, v.y, radius, 0, Math.PI * 2);

        const isSelected = selectedVertices?.some(
          (s) => s.id === v.id
        );

        const isActive = v.id === selectedVertexId;

        ctx.fillStyle = isSelected
          ? "#f472b6"
          : isActive
          ? "#ef4444"
          : v.color || "#ffffff";

        ctx.fill();

        ctx.strokeStyle = "#1a1b1e";
        ctx.lineWidth = 1 / zoom;
        ctx.stroke();
      });
    });

    ctx.restore();

  }, [
    polylines,
    selectedVertexId,
    selectedVertices,
    zoom,
    offset,
    showGrid,
    backgroundColor,
    gridColor,

    // 🔥 NEW DEPENDENCIES
    strokeWidth,
    opacity
  ]);

  // GRID
  const drawGrid = (ctx, width, height, zoom, offset, gridColor) => {
    const gridSize = 50;
    const subGridSize = 10;

    const startX =
      Math.floor(-offset.x / zoom / gridSize) * gridSize - gridSize;

    const startY =
      Math.floor(-offset.y / zoom / gridSize) * gridSize - gridSize;

    const endX = startX + width / zoom + gridSize * 2;
    const endY = startY + height / zoom + gridSize * 2;

    ctx.beginPath();
    ctx.strokeStyle = hexToRGBA(gridColor, 0.04);
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

    ctx.beginPath();
    ctx.strokeStyle = hexToRGBA(gridColor, 0.08);
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
  };

  const hexToRGBA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getCursor = () => {
    switch (mode) {
      case "PAN":
        return "grab";
      case "MOVE":
        return "move";
      case "DELETE":
        return "not-allowed";
      case "SELECT":
        return "default";
      default:
        return "crosshair";
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: getCursor()
      }}
    />
  );
};

export default Renderer2D;
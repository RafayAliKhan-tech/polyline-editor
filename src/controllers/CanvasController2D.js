// src/controllers/CanvasController2D.js
import { useState, useRef } from "react";
import Polyline2D from "../models/Polyline2D";
import CADHistory from "../models/CADHistory";

export default function useCanvasController2D(canvasRef, color) {
  const [polylines, setPolylines] = useState([]);
  const [currentPolyline, setCurrentPolyline] = useState(null);
  const [mode, setMode] = useState("DRAW");
  const [selectedVertexId, setSelectedVertexId] = useState(null);
  const [selectedVertices, setSelectedVertices] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [action, setAction] = useState("NONE");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState(null);

  const historyRef = useRef(new CADHistory());
  const THRESHOLD = 10;
  const MAX_POLYLINES = 100;

  // ================= HISTORY =================
  const pushHistory = (state) => {
    const snapshot = state.map((p) => p.clone());
    historyRef.current.push(snapshot);
  };

  const undo = () => {
    setPolylines((p) => historyRef.current.undo(p));
    setAction("UNDO");
  };

  const redo = () => {
    setPolylines((p) => historyRef.current.redo(p));
    setAction("REDO");
  };

  const reset = () => {
    setPolylines([]);
    setCurrentPolyline(null);
    historyRef.current.clear();
    setAction("RESET");
  };

  // ================= UTIL =================
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  };

  const findNearestVertex = (x, y) => {
    let nearest = null;
    let minDist = Infinity;

    for (const poly of polylines) {
      for (const v of poly.getVertices()) {
        const d = Math.hypot(v.x - x, v.y - y);
        if (d < minDist && d <= THRESHOLD) {
          minDist = d;
          nearest = v;
        }
      }
    }

    return nearest;
  };

  const findNearestEdge = (x, y) => {
    for (const poly of polylines) {
      const verts = poly.getVertices();

      for (let i = 0; i < verts.length - 1; i++) {
        const a = verts[i],
          b = verts[i + 1];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const denom = dx * dx + dy * dy;
        if (denom === 0) continue;

        const t = ((x - a.x) * dx + (y - a.y) * dy) / denom;

        if (t >= 0 && t <= 1) {
          const px = a.x + t * dx;
          const py = a.y + t * dy;

          if (Math.hypot(px - x, py - y) <= THRESHOLD) {
            return { poly, after: a };
          }
        }
      }
    }

    return null;
  };

  // ================= POLYLINE =================
  const finishPolyline = () => {
    if (!currentPolyline) return;

    const verts = currentPolyline.getVertices();
    if (verts.length > 1) {
      currentPolyline.removeVertexById(currentPolyline.tail.id);
    }

    setCurrentPolyline(null);
    setAction("POLYLINE_FINISHED");
  };

  // ================= MOUSE DOWN =================
  const handleMouseDown = (e) => {
    const { x, y } = getPos(e);
    setCoords({ x, y });

    // ===== DRAW =====
    if (mode === "DRAW") {
      if (!currentPolyline && polylines.length >= MAX_POLYLINES) {
        setAction("LIMIT_REACHED");
        return;
      }

      pushHistory(polylines);

      let poly = currentPolyline;

      if (!poly) {
        poly = new Polyline2D();
        poly.addVertex(x, y, null, color);
        poly.addVertex(x, y, null, color); // preview

        setCurrentPolyline(poly);
        setPolylines((prev) => [...prev, poly]);
      } else {
        poly.tail.x = x;
        poly.tail.y = y;
        poly.addVertex(x, y, null, color);
        setPolylines((prev) => [...prev]);
      }

      setAction("ADDING_VERTEX");
    }

    // ===== MOVE =====
    else if (mode === "MOVE") {
      const v = findNearestVertex(x, y);
      if (v) {
        pushHistory(polylines);
        setSelectedVertexId(v.id);
        setIsDragging(true);
        setAction("DRAGGING_VERTEX");
      }
    }

    // ===== DELETE =====
    else if (mode === "DELETE") {
      const v = findNearestVertex(x, y);
      if (v) {
        pushHistory(polylines);

        polylines.forEach((p) => {
          p.removeVertexById(v.id);
        });

        setPolylines([...polylines]);
        setAction("VERTEX_DELETED");
      }
    }

    // ===== INSERT =====
    else if (mode === "INSERT") {
      const edge = findNearestEdge(x, y);
      if (edge) {
        pushHistory(polylines);
        edge.poly.insertAfter(edge.after, x, y, null, color);
        setPolylines([...polylines]);
        setAction("VERTEX_INSERTED");
      }
    }

    // ===== SELECT (CTRL multi-select) =====
    else if (mode === "SELECT") {
      const v = findNearestVertex(x, y);
      if (v) {
        if (e.ctrlKey) {
          setSelectedVertices((prev) => [...prev, v]);
        } else {
          setSelectedVertices([v]);
        }
      }
    }

    // ===== PAN =====
    else if (mode === "PAN") {
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        ox: offset.x,
        oy: offset.y,
      });
    }
  };

  // ================= MOUSE MOVE =================
  const handleMouseMove = (e) => {
    const { x, y } = getPos(e);
    setCoords({ x, y });

    if (mode === "DRAW" && currentPolyline) {
      const tail = currentPolyline.tail;
      if (tail) {
        tail.x = x;
        tail.y = y;
        setPolylines((p) => [...p]);
      }
    }

    if (isDragging && selectedVertexId) {
      polylines.forEach((poly) => {
        const v = poly.findVertexById(selectedVertexId);
        if (v) {
          v.x = x;
          v.y = y;
        }
      });
      setPolylines([...polylines]);
    }

    if (mode === "PAN" && panStart) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;

      setOffset({
        x: panStart.ox + dx,
        y: panStart.oy + dy,
      });
    }
  };

  // ================= MOUSE UP =================
  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedVertexId(null);
    setPanStart(null);
    setAction("NONE");
  };

  // ================= DOUBLE CLICK =================
  const handleDoubleClick = () => finishPolyline();

  // ================= ZOOM =================
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((z) => Math.min(Math.max(0.2, z * delta), 5));
  };

  // ================= SAVE =================
  const saveToFile = () => {
    const data = JSON.stringify(
      polylines.map((p) => ({
        vertices: p.getVertices().map((v) => ({
          x: v.x,
          y: v.y,
          color: v.color,
        })),
      }))
    );

    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "polylines.json";
    a.click();
  };

  // ================= LOAD =================
  const loadFromFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);

      const loaded = json.map((p) => {
        const poly = new Polyline2D();
        p.vertices.forEach((v) =>
          poly.addVertex(v.x, v.y, 0, v.color)
        );
        return poly;
      });

      setPolylines(loaded);
      historyRef.current.clear();
      setAction("LOADED");
    };

    reader.readAsText(file);
  };

  // ================= EXPORT SVG =================
  const exportSVG = () => {
    const svg = polylines
      .map((p) => {
        const points = p
          .getVertices()
          .map((v) => `${v.x},${v.y}`)
          .join(" ");
        return `<polyline points="${points}" stroke="#00d2ff" fill="none" stroke-width="2"/>`;
      })
      .join("\n");

    const blob = new Blob(
      [`<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`],
      { type: "image/svg+xml" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "polylines.svg";
    a.click();
  };

  // ================= EXPORT OBJ =================
  const exportOBJ = () => {
    let obj = "";
    let index = 1;

    polylines.forEach((p) => {
      const verts = p.getVertices();

      verts.forEach((v) => {
        obj += `v ${v.x} ${v.y} ${v.z || 0}\n`;
      });

      obj += "l ";
      for (let i = 0; i < verts.length; i++) {
        obj += `${index++} `;
      }
      obj += "\n";
    });

    const blob = new Blob([obj], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "polylines.obj";
    a.click();
  };

  return {
    polylines,
    mode,
    setMode,
    selectedVertexId,
    selectedVertices,
    action,
    coords,
    zoom,
    offset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    handleWheel,
    undo,
    redo,
    reset,
    saveToFile,
    loadFromFile,
    exportSVG,
    exportOBJ,
  };
}
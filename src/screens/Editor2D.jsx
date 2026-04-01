// src/screens/Editor2D.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCanvasController2D from "../controllers/CanvasController2D";
import useCanvasInteraction from "../hooks/useCanvasInteraction";
import Renderer2D from "../views/Renderer2D";
import StatusBar from "../components/StatusBar/StatusBar";
import Toolbar from "../components/Toolbar/Toolbar";
import TopBar from "../components/TopBar/TopBar";
import Renderer3D from "../views/Renderer3D";
import { useEditor } from "../context/EditorContext";

const Editor2D = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTool, setActiveTool] = useState("draw");
  const [color, setColor] = useState("#4ade80");

  // Style States
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(100);
  const [activeTab, setActiveTab] = useState("style");
  const [showContextMenu, setShowContextMenu] = useState(true);

  const {
    polylines, mode, setMode, selectedVertexId, selectedVertices,
    action, coords, zoom, offset, handleMouseDown, handleMouseMove,
    handleMouseUp, handleDoubleClick, handleWheel, undo, redo, reset,
    saveToFile, loadFromFile, exportSVG, exportOBJ,
  } = useCanvasController2D(canvasRef, color);

  const { mode: viewMode, MODES } = useEditor();

  const {
    backgroundType = "grid",
    backgroundColor = "#7c3aed"
  } = location.state || {};

  useEffect(() => {
    setActiveTool(mode.toLowerCase());
  }, [mode]);

  useCanvasInteraction({
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
  });

  const handleQuit = () => {
    if (window.confirm("Exit editor?")) navigate("/canvas-background");
  };

  // Shortcuts
  useEffect(() => {
    const handleKeys = (e) => {
      const key = e.key.toLowerCase();
      if (key === "q") return handleQuit();
      if (e.ctrlKey && key === "z") return undo();
      if (e.ctrlKey && key === "y") return redo();
      if (key === "r") return reset();

      const map = { b: "DRAW", m: "MOVE", d: "DELETE", i: "INSERT", s: "SELECT", p: "PAN" };
      if (map[key]) setMode(map[key]);
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [setMode, undo, redo, reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div style={{ ...styles.container, background: backgroundType === "color" ? backgroundColor : styles.container.background }}>
      <Toolbar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        setMode={setMode} 
        undo={undo} redo={redo} reset={reset} onQuit={handleQuit} 
      />

      <div style={{ ...styles.mainArea, background: backgroundType === "color" ? backgroundColor : styles.mainArea.background }}>
        <TopBar zoom={zoom} saveToFile={saveToFile} loadFromFile={loadFromFile} exportSVG={exportSVG} exportOBJ={exportOBJ} />

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {viewMode === MODES.EDIT_2D && (
            <Renderer2D
              canvasRef={canvasRef}
              polylines={polylines}
              selectedVertexId={selectedVertexId}
              selectedVertices={selectedVertices}
              mode={mode}
              zoom={zoom}
              offset={offset}
              showGrid={backgroundType === "grid"}
              backgroundColor={backgroundType === "grid" ? "#0a0f1a" : backgroundColor}
              gridColor={backgroundColor}
              // ✅ PASSING NEW PROPS HERE
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
          )}

          {viewMode === MODES.PREVIEW_3D && <Renderer3D polylines={polylines} />}
        </div>

        <StatusBar mode={mode} action={action} coords={coords} />
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.panelHeader}><span>Properties</span></div>
        <div style={styles.tabs}>
          {["style", "design", "export"].map((tab) => (
            <span key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.activeTab : {}}>{tab}</span>
          ))}
        </div>

        {activeTab === "style" && (
          <>
            <div style={styles.section}>
              <label style={styles.label}>Color</label>
              <div style={styles.colorPalette}>
                {["#9e1212","#c96c1a","#b5a31a","#1a7d32","#1a5b7d","#4b1a7d","#121212","#ffffff"].map((c) => (
                  <div key={c} onClick={() => setColor(c)} style={{ ...styles.colorBox, background: c, border: color === c ? "2px solid #fff" : "1px solid #333" }} />
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>Stroke Width ({strokeWidth}px)</label>
              <input type="range" min="1" max="20" value={strokeWidth} onChange={(e) => setStrokeWidth(+e.target.value)} style={{ width: "100%" }} />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>Opacity ({opacity}%)</label>
              <input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(+e.target.value)} style={{ width: "100%" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh", background: "#1a1b1e", color: "#fff" },
  mainArea: { flex: 1, display: "flex", flexDirection: "column", background: "#25262b" },
  rightPanel: { width: "240px", background: "#25262b", padding: "20px", borderLeft: "1px solid #333" },
  panelHeader: { marginBottom: "20px", fontWeight: "bold" },
  tabs: { display: "flex", gap: "15px", marginBottom: "20px", cursor: "pointer", fontSize: "12px", textTransform: "uppercase" },
  activeTab: { color: "#4ade80", borderBottom: "2px solid #4ade80" },
  section: { marginBottom: "25px" },
  label: { fontSize: "11px", marginBottom: "10px", display: "block", color: "#888" },
  colorPalette: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" },
  colorBox: { height: "25px", borderRadius: "4px", cursor: "pointer" }
};

export default Editor2D;
// src/screens/Editor2D.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCanvasController2D from "../controllers/CanvasController2D";
import useCanvasInteraction from "../hooks/useCanvasInteraction";
import Renderer2D from "../views/Renderer2D";
import StatusBar from "../components/StatusBar/StatusBar";
import Toolbar from "../components/Toolbar/Toolbar";
import TopBar from "../components/TopBar/TopBar"; // Naya TopBar import karein

const Editor2D = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [activeTool, setActiveTool] = useState("draw");
  const [color, setColor] = useState("#4ade80");

  const {
    polylines, mode, setMode, selectedVertexId, selectedVertices,
    action, coords, zoom, offset, handleMouseDown, handleMouseMove,
    handleMouseUp, handleDoubleClick, handleWheel, undo, redo, reset,
    saveToFile, loadFromFile, exportSVG, exportOBJ,
  } = useCanvasController2D(canvasRef, color);

  useEffect(() => {
    setActiveTool(mode.toLowerCase());
  }, [mode]);

  useCanvasInteraction({
    canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleDoubleClick,
  });

  const handleQuit = () => {
    if (window.confirm("Exit editor?")) navigate("/canvas-select");
  };

  useEffect(() => {
    const handleKeys = (e) => {
      const key = e.key.toLowerCase();
      if (key === "q") return handleQuit();
      if (key === "z") return undo();
      if (key === "y") return redo();
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
    <div style={styles.container}>
      
      {/* 🛠 LEFT SIDEBAR (Ab sirf Tools aur Undo/Redo/Reset ke liye) */}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        setMode={setMode}
        undo={undo}
        redo={redo}
        reset={reset}
        onQuit={handleQuit}
      />

      {/* 🖥 MAIN AREA */}
      <div style={styles.mainArea}>
        
        {/* 📑 TOPBAR (Save, Load, Export yahan shift ho gaye hain) */}
        <TopBar 
          zoom={zoom}
          saveToFile={saveToFile}
          loadFromFile={loadFromFile}
          exportSVG={exportSVG}
          exportOBJ={exportOBJ}
        />

        {/* 🖱 CONTEXT POPUP (Screenshot jaisa floating menu) */}
        {(selectedVertexId || selectedVertices?.length > 0) && (
          <div style={styles.contextMenu}>
            <div style={styles.contextHeader}>
              <span>✥ Move</span>
              <span style={{cursor: 'pointer'}}>✕</span>
            </div>
            <div style={styles.contextItem} onClick={() => setMode("MOVE")}><span>✕</span> X</div>
            <div style={styles.contextItem} onClick={() => setMode("MOVE")}><span>✥</span> Move</div>
            <div style={styles.contextItem} onClick={() => setMode("DELETE")}><span>🗑</span> Delete</div>
          </div>
        )}

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Renderer2D
            canvasRef={canvasRef}
            polylines={polylines}
            selectedVertexId={selectedVertexId}
            selectedVertices={selectedVertices}
            mode={mode}
            zoom={zoom}
            offset={offset}
          />
        </div>

        <StatusBar mode={mode} action={action} coords={coords} />
      </div>

      {/* ⚙️ RIGHT PANEL (Properties) */}
      <div style={styles.rightPanel}>
        <div style={styles.panelHeader}>
          <span>Properties</span>
          <span style={{fontSize: '18px'}}>›</span>
        </div>
        
        <div style={styles.tabs}>
          <span style={styles.activeTab}>Style</span>
          <span>Design</span>
          <span>Export</span>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Color</label>
          <div style={styles.colorPalette}>
            {["#9e1212", "#c96c1a", "#b5a31a", "#1a7d32", "#1a5b7d", "#4b1a7d", "#121212", "#ffffff"].map(c => (
              <div 
                key={c} 
                onClick={() => setColor(c)}
                style={{...styles.colorBox, background: c, border: color === c ? '2px solid #fff' : '1px solid #333'}} 
              />
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Stroke Width</label>
          <div style={styles.strokeSelector}>—— 3 px</div>
          <div style={styles.strokeLines}>
            <div style={{height: '1px', background: '#444', width: '100%'}} />
            <div style={{height: '3px', background: '#888', width: '100%'}} />
            <div style={{height: '5px', background: color, width: '100%'}} />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Opacity</label>
          <input type="range" style={{width: '100%', accentColor: color}} />
          <div style={{textAlign: 'right', fontSize: '10px', marginTop: '5px'}}>100%</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh", background: "#1a1b1e", color: "#fff", fontFamily: 'sans-serif', overflow: 'hidden' },
  mainArea: { flex: 1, display: "flex", flexDirection: "column", position: "relative", background: "#25262b" },
  
  contextMenu: { position: "absolute", bottom: "80px", left: "20px", width: "160px", background: "#fff", color: "#333", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 20 },
  contextHeader: { display: 'flex', justifyContent: 'space-between', padding: '10px', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #eee' },
  contextItem: { padding: '10px', display: 'flex', gap: '10px', cursor: 'pointer', fontSize: '12px', transition: 'background 0.2s' },

  // Panels
  rightPanel: { width: "240px", background: "#25262b", borderLeft: "1px solid #373a40", padding: "20px" },
  panelHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold' },
  tabs: { display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '13px', color: '#909296', borderBottom: '1px solid #373a40', paddingBottom: '10px' },
  activeTab: { color: '#4ade80', borderBottom: '2px solid #4ade80', paddingBottom: '10px' },
  section: { marginBottom: '25px' },
  label: { fontSize: '11px', color: '#909296', marginBottom: '10px', display: 'block' },
  colorPalette: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  colorBox: { height: '25px', borderRadius: '4px', cursor: 'pointer' },
  strokeSelector: { background: '#2c2e33', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '12px', marginBottom: '10px' },
  strokeLines: { display: 'flex', flexDirection: 'column', gap: '8px' }
};

export default Editor2D;
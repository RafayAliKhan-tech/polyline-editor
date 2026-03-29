import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Toolbar from "../components/Toolbar/Toolbar";
import StatusBar from "../components/StatusBar/StatusBar";

const EditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { width = 800, height = 600 } = location.state || {};

  const [activeTool, setActiveTool] = useState("draw");
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Keyboard Shortcuts (HCI Requirement: B, M, D, R, Q)
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'b') setActiveTool("draw");
      if (key === 'm') setActiveTool("move");
      if (key === 'd') setActiveTool("erase");
      if (key === 'r') window.location.reload();
      if (key === 'q') navigate("/");
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  // Mouse tracking for status bar
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  };

  return (
    <div style={styles.mainWrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate("/canvas-select")}>
           <span style={{color: '#64748b'}}>‹</span> Polyline <span style={{color: '#00d2ff'}}>Studio</span>
        </div>
        <div style={styles.projInfo}>Project: {width}x{height}</div>
      </header>

      {/* Modular Toolbar */}
      <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />

      {/* Canvas Body */}
      <div style={styles.editorBody}>
        <main style={styles.viewport}>
          <motion.div 
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ ...styles.canvas, width: `${width}px`, height: `${height}px` }}
          >
            {/* Drawing Content Will Be Rendered Here */}
            <div style={styles.canvasPlaceholder}>
              <p style={{color: '#cbd5e1', fontSize: '12px'}}>Click to start drawing in {activeTool} mode</p>
            </div>
          </motion.div>
        </main>

        {/* Right Info Panel */}
        <aside style={styles.rightPanel}>
          <h4 style={styles.sideTitle}>MVC INFO</h4>
          <div style={styles.infoCard}>
             <label style={styles.label}>MODEL</label>
             <div style={styles.data}>Polylines: 0</div>
          </div>
          <div style={styles.infoCard}>
             <label style={styles.label}>VIEW</label>
             <div style={styles.data}>2D Mode Active</div>
          </div>
        </aside>
      </div>

      {/* Modular Status Bar */}
      <StatusBar mode={activeTool} x={coords.x} y={coords.y} />
    </div>
  );
};

const styles = {
  mainWrapper: { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0a0f1a", color: "#fff", overflow: "hidden" },
  header: { height: "50px", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f172a" },
  logo: { fontWeight: "bold", cursor: "pointer", fontSize: "18px" },
  projInfo: { fontSize: "12px", color: "#64748b" },
  editorBody: { flex: 1, display: "flex", overflow: "hidden" },
  viewport: { flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center", padding: "50px", backgroundColor: "#050810", backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", backgroundSize: "30px 30px" },
  canvas: { backgroundColor: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", borderRadius: "4px", flexShrink: 0, position: "relative" },
  canvasPlaceholder: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  rightPanel: { width: "200px", backgroundColor: "#0f172a", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "20px" },
  sideTitle: { fontSize: "10px", letterSpacing: "2px", color: "#475569", marginBottom: "20px" },
  infoCard: { marginBottom: "20px" },
  label: { fontSize: "10px", color: "#64748b", fontWeight: "bold" },
  data: { fontSize: "13px", color: "#00d2ff", marginTop: "4px" }
};

export default EditorPage;
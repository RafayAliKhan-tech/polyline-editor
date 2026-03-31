//src/screens/CanvasSelectionPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CANVAS } from "../utils/constants"; // Importing our constants

const CanvasSelectionPage = () => {
  const navigate = useNavigate();

  // State initialized with constants
  const [width, setWidth] = useState(CANVAS.DEFAULT_WIDTH);
  const [height, setHeight] = useState(CANVAS.DEFAULT_HEIGHT);
  const [error, setError] = useState("");

  const presets = [
    { name: "SD", w: 640, h: 480, icon: "📱" },
    { name: "HD", w: 1280, h: 720, icon: "💻" },
    { name: "FHD", w: 1920, h: 1080, icon: "🖥️" },
  ];

  // Validation Logic using centralized constants
  useEffect(() => {
    if (width > CANVAS.MAX_WIDTH || height > CANVAS.MAX_HEIGHT) {
      setError(`Max limit exceeded: ${CANVAS.MAX_WIDTH}x${CANVAS.MAX_HEIGHT}`);
    } else if (width < CANVAS.MIN_WIDTH || height < CANVAS.MIN_HEIGHT) {
      setError(`Minimum required: ${CANVAS.MIN_WIDTH}x${CANVAS.MIN_HEIGHT}`);
    } else {
      setError("");
    }
  }, [width, height]);

  const handleNext = () => {
  if (!error) {
    navigate("/canvas-background", {
      state: { width, height }
    });
  }
};
  // const handleNext = () => {
  //   if (!error) {
  //     // Navigating to 2D Editor with dimensions in state
  //     navigate("/2d", { state: { width, height } });
  //   }
  // };

  // Helper for responsive preview box (Calculates scale to fit container)
  const getPreviewSize = () => {
    const maxContainerSize = 160; 
    const ratio = width / height;
    return width > height 
      ? { w: maxContainerSize, h: maxContainerSize / ratio }
      : { w: maxContainerSize * ratio, h: maxContainerSize };
  };

  const previewDim = getPreviewSize();

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <header style={{ marginBottom: "25px" }}>
          <h2 style={styles.title}>Canvas <span style={{color: '#00d2ff'}}>Studio</span></h2>
          <p style={styles.subtitle}>Define your workspace dimensions</p>
        </header>

        {/* Manual Inputs */}
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Width (px)</label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(parseInt(e.target.value) || 0)} 
              style={{...styles.input, borderColor: error && width > CANVAS.MAX_WIDTH ? "#ff4757" : "rgba(255,255,255,0.1)"}}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Height (px)</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)} 
              style={{...styles.input, borderColor: error && height > CANVAS.MAX_HEIGHT ? "#ff4757" : "rgba(255,255,255,0.1)"}}
            />
          </div>
        </div>

        {/* Presets */}
        <div style={styles.presetsGrid}>
          {presets.map((p) => {
            const isActive = width === p.w && height === p.h;
            return (
              <motion.div
                key={p.name}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setWidth(p.w); setHeight(p.h); }}
                style={{
                  ...styles.presetCard,
                  borderColor: isActive ? "#00d2ff" : "rgba(255,255,255,0.1)",
                  backgroundColor: isActive ? "rgba(0, 210, 255, 0.12)" : "rgba(255,255,255,0.03)"
                }}
              >
                <span style={{ fontSize: "18px" }}>{p.icon}</span>
                <span style={styles.presetName}>{p.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Aspect Ratio Preview */}
        <div style={styles.previewWrapper}>
            <motion.div 
                animate={{ width: previewDim.w, height: previewDim.h }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                style={styles.previewBox}
            >
                <div style={styles.dimensionTag}>{width} x {height}</div>
            </motion.div>
        </div>

        {/* Error Feedback */}
        <div style={{ height: "24px", margin: "10px 0" }}>
            <AnimatePresence mode="wait">
                {error && (
                    <motion.p 
                      key={error}
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 10 }} 
                      style={styles.errorText}
                    >
                        ⚠️ {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>

        <motion.button 
          disabled={!!error}
          whileHover={!error ? { scale: 1.02, boxShadow: "0 0 20px rgba(0, 210, 255, 0.4)" } : {}}
          whileTap={!error ? { scale: 0.98 } : {}}
          style={{...styles.nextButton, opacity: error ? 0.4 : 1, cursor: error ? "not-allowed" : "pointer"}} 
          onClick={handleNext}
        >
          Next
        </motion.button>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh", width: "100%", backgroundColor: "#0a0f1a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Inter', sans-serif", color: "#fff", overflow: "hidden", position: "relative",
  },
  bgGlow: {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    width: "70vw", height: "70vh", pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0, 210, 255, 0.1) 0%, rgba(10, 15, 26, 0) 70%)",
    filter: "blur(80px)",
  },
  card: {
    width: "420px", padding: "35px", borderRadius: "28px",
    backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
    zIndex: 2,
  },
  title: { fontSize: "28px", fontWeight: "800", margin: "0 0 8px 0" },
  subtitle: { fontSize: "14px", color: "#94a3b8", margin: 0 },
  inputRow: { display: "flex", gap: "15px", marginTop: "25px" },
  inputGroup: { flex: 1 },
  label: { display: "block", fontSize: "10px", color: "#64748b", marginBottom: "6px", fontWeight: "700", textTransform: "uppercase" },
  input: {
    width: "100%", padding: "12px", backgroundColor: "rgba(0,0,0,0.2)",
    border: "1px solid", borderRadius: "10px", color: "#fff",
    fontSize: "15px", outline: "none", transition: "border 0.2s ease", boxSizing: "border-box"
  },
  presetsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", margin: "20px 0" },
  presetCard: {
    padding: "10px", borderRadius: "14px", border: "1px solid",
    cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "4px", transition: "all 0.2s ease"
  },
  presetName: { fontSize: "11px", fontWeight: "600" },
  previewWrapper: {
    height: "170px", width: "100%", backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "14px", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "15px", boxSizing: "border-box"
  },
  previewBox: {
    border: "2px solid #00d2ff", borderRadius: "4px", display: "flex",
    alignItems: "center", justifyContent: "center", position: "relative",
    backgroundColor: "rgba(0, 210, 255, 0.05)",
  },
  dimensionTag: { fontSize: "9px", color: "#00d2ff", fontWeight: "bold", position: "absolute", background: "#0a0f1a", padding: "2px 4px", borderRadius: "4px" },
  errorText: { color: "#ff4757", fontSize: "12px", margin: 0, textAlign: "center", fontWeight: "500" },
  nextButton: {
    width: "100%", padding: "15px", borderRadius: "12px",
    border: "none", backgroundColor: "#00d2ff", color: "#0a0f1a",
    fontSize: "15px", fontWeight: "700", transition: "all 0.3s ease"
  },
};

export default CanvasSelectionPage;
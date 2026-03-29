import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CanvasSelectionPage = () => {
  const navigate = useNavigate();

  // Constraints
  const MIN_WIDTH = 400, MIN_HEIGHT = 300;
  const MAX_WIDTH = 1920, MAX_HEIGHT = 1080;

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [error, setError] = useState("");

  const presets = [
    { name: "SD", w: 640, h: 480, icon: "📱" },
    { name: "HD", w: 1280, h: 720, icon: "💻" },
    { name: "FHD", w: 1920, h: 1080, icon: "🖥️" },
  ];

  // Validation logic
  useEffect(() => {
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      setError(`Max limit exceeded: ${MAX_WIDTH}x${MAX_HEIGHT}`);
    } else if (width < MIN_WIDTH || height < MIN_HEIGHT) {
      setError(`Minimum required: ${MIN_WIDTH}x${MIN_HEIGHT}`);
    } else {
      setError("");
    }
  }, [width, height]);

  const handleNext = () => {
    if (!error) {
      navigate("/editor", { state: { width, height } });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.card}
      >
        <header style={{ marginBottom: "30px" }}>
          <h2 style={styles.title}>Canvas <span style={{color: '#00d2ff'}}>Studio</span></h2>
          <p style={styles.subtitle}>Define your workspace dimensions</p>
        </header>

        {/* Manual Inputs */}
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Width</label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(Math.max(0, parseInt(e.target.value) || 0))} 
              style={{...styles.input, borderColor: error && width > MAX_WIDTH ? "#ff4757" : "rgba(255,255,255,0.1)"}}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Height</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(Math.max(0, parseInt(e.target.value) || 0))} 
              style={{...styles.input, borderColor: error && height > MAX_HEIGHT ? "#ff4757" : "rgba(255,255,255,0.1)"}}
            />
          </div>
        </div>

        {/* Presets Grid */}
        <div style={styles.presetsGrid}>
          {presets.map((p) => {
            const isActive = width === p.w && height === p.h;
            return (
              <motion.div
                key={p.name}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setWidth(p.w); setHeight(p.h); }}
                style={{
                  ...styles.presetCard,
                  borderColor: isActive ? "#00d2ff" : "rgba(255,255,255,0.1)",
                  backgroundColor: isActive ? "rgba(0, 210, 255, 0.15)" : "rgba(255,255,255,0.03)"
                }}
              >
                <span style={{ fontSize: "20px" }}>{p.icon}</span>
                <span style={styles.presetName}>{p.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Preview */}
        <div style={styles.previewWrapper}>
            <motion.div 
                animate={{ 
                    aspectRatio: `${width}/${height}`,
                }}
                style={styles.previewBox}
            >
                <div style={styles.dimensionTag}>{width} x {height}</div>
            </motion.div>
        </div>

        {/* Error Message */}
        <div style={{ height: "20px", marginBottom: "15px" }}>
            <AnimatePresence>
                {error && (
                    <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={styles.errorText}>
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>

        <motion.button 
          disabled={!!error}
          whileHover={!error ? { scale: 1.02, backgroundColor: "#00e5ff" } : {}}
          whileTap={!error ? { scale: 0.98 } : {}}
          style={{...styles.nextButton, opacity: error ? 0.5 : 1, cursor: error ? "not-allowed" : "pointer"}} 
          onClick={handleNext}
        >
          Launch Editor
        </motion.button>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh", width: "100%", backgroundColor: "#0a0f1a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif", color: "#fff",
    overflow: "hidden", position: "relative",
  },
  bgGlow: {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    width: "80vw", height: "80vh", pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, rgba(10, 15, 26, 0) 70%)",
    filter: "blur(100px)",
  },
  card: {
    width: "450px", padding: "40px", borderRadius: "32px",
    backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  title: { fontSize: "32px", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-1px" },
  subtitle: { fontSize: "15px", color: "#64748b", margin: 0 },
  inputRow: { display: "flex", gap: "20px", marginTop: "30px" },
  inputGroup: { flex: 1 },
  label: { display: "block", fontSize: "11px", color: "#475569", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" },
  input: {
    width: "100%", padding: "14px", backgroundColor: "rgba(0,0,0,0.3)",
    border: "1px solid", borderRadius: "12px", color: "#fff",
    fontSize: "16px", outline: "none", transition: "all 0.3s ease", boxSizing: "border-box"
  },
  presetsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", margin: "25px 0" },
  presetCard: {
    padding: "12px", borderRadius: "16px", border: "1px solid",
    cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "6px", transition: "all 0.2s ease"
  },
  presetName: { fontSize: "12px", fontWeight: "600" },
  previewWrapper: {
    height: "140px", width: "100%", backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "16px", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "20px", boxSizing: "border-box"
  },
  previewBox: {
    maxHeight: "100%", maxWidth: "100%", border: "2px solid #00d2ff",
    borderRadius: "6px", display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative",
    backgroundColor: "rgba(0, 210, 255, 0.05)",
  },
  dimensionTag: { fontSize: "10px", color: "#00d2ff", fontWeight: "bold", position: "absolute" },
  errorText: { color: "#ff4757", fontSize: "13px", margin: 0, fontWeight: "500" },
  nextButton: {
    width: "100%", padding: "16px", borderRadius: "16px",
    border: "none", backgroundColor: "#00d2ff", color: "#0a0f1a",
    fontSize: "16px", fontWeight: "700", transition: "all 0.3s ease"
  },
};

export default CanvasSelectionPage;
// src/components/CanvasSizeSelector/CanvasSelectionPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CanvasSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState("Medium");
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(720);
  const [error, setError] = useState("");

  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 300;
  const MAX_WIDTH = 2000;
  const MAX_HEIGHT = 1500;

  const presets = [
    { name: "Small", w: 800, h: 600, label: "800 × 600" },
    { name: "Medium", w: 1280, h: 720, label: "1280 × 720" },
    { name: "Large", w: 1920, h: 1200, label: "1920 × 1200" },
  ];

  const handleNext = () => {
    const selected = presets.find(p => p.name === selectedPreset);
    const width = selected ? selected.w : Number(customWidth);
    const height = selected ? selected.h : Number(customHeight);

    if (!width || !height || width < MIN_WIDTH || height < MIN_HEIGHT || width > MAX_WIDTH || height > MAX_HEIGHT) {
      setError(`Canvas size must be between ${MIN_WIDTH}×${MIN_HEIGHT} and ${MAX_WIDTH}×${MAX_HEIGHT}`);
      return;
    }

    setError("");
    navigate("/canvas-background", { state: { width, height } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow}></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        <header style={styles.header}>
          <h2 style={styles.mainTitle}>
            Polyline<span style={{ color: "#00d2ff" }}>Studio</span>
          </h2>
          <p style={styles.subtitle}>Select Your Aspect Ratio</p>
        </header>

        <div style={styles.presetsRow}>
          {presets.map(p => (
            <motion.div
              key={p.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedPreset(p.name);
                setError("");
              }}
              style={{
                ...styles.presetCard,
                borderColor: selectedPreset === p.name ? "#00d2ff" : "rgba(255,255,255,0.1)",
                backgroundColor: selectedPreset === p.name ? "rgba(0, 210, 255, 0.1)" : "rgba(255,255,255,0.03)"
              }}
            >
              <div style={styles.ratioBox}>
                <div style={{
                  ...styles.innerBox,
                  width: p.name === "Small" ? "50%" : p.name === "Medium" ? "70%" : "85%",
                  borderColor: selectedPreset === p.name ? "#00d2ff" : "rgba(255,255,255,0.3)"
                }}></div>
              </div>
              <h3 style={{ ...styles.presetName, color: selectedPreset === p.name ? "#00d2ff" : "#fff" }}>{p.name}</h3>
              <p style={styles.presetLabel}>{p.label}</p>
              {selectedPreset === p.name && <div style={styles.checkBadge}>✓</div>}
            </motion.div>
          ))}
        </div>

        <div style={styles.customSection}>
          <div style={styles.customTag}>Custom Dimensions</div>
          <div style={styles.inputContainer}>
            <div style={styles.field}>
              <span style={styles.inputLabel}>W</span>
              <input
                type="number"
                value={customWidth}
                onChange={e => {
                  setCustomWidth(Number(e.target.value));
                  setSelectedPreset(null);
                  setError("");
                }}
                style={styles.input}
              />
            </div>
            <span style={{ margin: "0 10px", color: "rgba(255,255,255,0.3)" }}>×</span>
            <div style={styles.field}>
              <span style={styles.inputLabel}>H</span>
              <input
                type="number"
                value={customHeight}
                onChange={e => {
                  setCustomHeight(Number(e.target.value));
                  setSelectedPreset(null);
                  setError("");
                }}
                style={styles.input}
              />
            </div>
          </div>
          {error && <div style={styles.errorText}>{error}</div>}
        </div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(0, 210, 255, 0.4)" }}
          whileTap={{ scale: 0.97 }}
          style={styles.nextBtn}
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
    height: "100vh",
    width: "100%",
    backgroundColor: "#0a0f1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  bgGlow: {
    position: "absolute",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(0,210,255,0.05) 0%, rgba(10,15,26,0) 70%)",
    filter: "blur(80px)",
    zIndex: 0
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "40px",
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
    zIndex: 1
  },
  header: { marginBottom: "30px", textAlign: "center" },
  mainTitle: { fontSize: "32px", fontWeight: "800", color: "#fff", margin: "0 0 5px 0", letterSpacing: "-1px" },
  subtitle: { color: "#94a3b8", fontSize: "14px", margin: 0 },
  presetsRow: { display: "flex", gap: "15px", marginBottom: "35px" },
  presetCard: {
    flex: 1,
    padding: "15px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    position: "relative",
    border: "1px solid",
    transition: "all 0.3s ease"
  },
  ratioBox: { height: "70px", background: "rgba(0,0,0,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" },
  innerBox: { height: "50%", border: "1.5px solid", borderRadius: "2px" },
  presetName: { fontSize: "14px", fontWeight: "700", margin: "0 0 4px 0" },
  presetLabel: { color: "#64748b", fontSize: "11px", margin: 0 },
  checkBadge: { position: "absolute", top: "-8px", right: "-8px", background: "#00d2ff", color: "#0a0f1a", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  customSection: { background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", marginBottom: "30px" },
  customTag: { position: "absolute", top: "-10px", left: "20px", background: "#0f172a", padding: "0 10px", fontSize: "12px", color: "#64748b", fontWeight: "600" },
  inputContainer: { display: "flex", alignItems: "center", justifyContent: "center" },
  field: { display: "flex", alignItems: "center", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "5px 10px", border: "1px solid rgba(255,255,255,0.1)" },
  input: { background: "none", border: "none", width: "60px", color: "#fff", textAlign: "center", fontSize: "16px", outline: "none", fontWeight: "600" },
  inputLabel: { color: "#00d2ff", fontWeight: "bold", fontSize: "12px", marginRight: "8px" },
  errorText: { color: "#ff4d6d", fontSize: "12px", marginTop: "8px", textAlign: "center", fontWeight: "600" },
  nextBtn: { width: "100%", background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)", color: "#0a0f1a", padding: "16px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "800", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }
};

export default CanvasSelectionPage;
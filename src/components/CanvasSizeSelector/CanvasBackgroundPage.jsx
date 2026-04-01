// src/components/CanvasSizeSelector/CanvasBackgroundPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const COLORS = [
  "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#f8fafc",
  "#7c3aed", "#4f46e5", "#2563eb", "#0ea5e9", "#06b6d4", "#14b8a6",
  "#10b981", "#84cc16", "#eab308", "#f97316"
];

const CanvasBackgroundPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [mode, setMode] = useState("grid"); // grid | color
  const [selectedColor, setSelectedColor] = useState("#7c3aed");

  // ✅ FIXED NAVIGATION (IMPORTANT)
  const handleCreate = () => {
    navigate("/editor", {
      state: {
        ...state,
        backgroundType: mode,
        backgroundColor: selectedColor
      }
    });
  };

  // ✅ PREVIEW STYLE
  const getPreviewStyle = () => {
    if (mode === "grid") {
      return {
        backgroundColor: "#0f172a",
        backgroundImage: `
          linear-gradient(to right, ${selectedColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${selectedColor} 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        transition: "0.3s"
      };
    }

    return {
      backgroundColor: selectedColor,
      backgroundImage: "none",
      transition: "0.3s"
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow}></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        <header style={styles.header}>
          <h2 style={styles.mainTitle}>
            Polyline<span style={{ color: "#00d2ff" }}>Studio</span>
          </h2>
          <p style={styles.subtitle}>Customize Your Workspace</p>
        </header>

        <div style={styles.splitLayout}>
          {/* LEFT PANEL */}
          <div style={styles.previewPanel}>
            <div style={{ ...styles.previewDisplay, ...getPreviewStyle() }}>
              <span style={styles.previewLabel}>
                {mode.toUpperCase()} PREVIEW
              </span>
            </div>

            <div style={styles.colorGrid}>
              {COLORS.map((color) => (
                <motion.div
                  key={color}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    ...styles.colorCircle,
                    backgroundColor: color,
                    border:
                      selectedColor === color
                        ? "2px solid #00d2ff"
                        : "1px solid rgba(255,255,255,0.1)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={styles.optionsPanel}>
            {["grid", "color"].map((m) => (
              <div
                key={m}
                style={{
                  ...styles.optionItem,
                  backgroundColor:
                    mode === m
                      ? "rgba(0, 210, 255, 0.1)"
                      : "transparent",
                  borderColor:
                    mode === m
                      ? "#00d2ff"
                      : "rgba(255,255,255,0.1)"
                }}
                onClick={() => setMode(m)}
              >
                <div
                  style={{
                    ...styles.radioCircle,
                    backgroundColor:
                      mode === m ? "#00d2ff" : "transparent"
                  }}
                ></div>

                <span
                  style={{
                    ...styles.radioLabel,
                    color: mode === m ? "#fff" : "#94a3b8"
                  }}
                >
                  {m === "grid" ? "Grid Canvas" : "Solid Color"}
                </span>
              </div>
            ))}

            <div style={styles.infoBox}>
              <p style={{ margin: 0 }}>
                💡 TIP: Grid helps in precise vertex placement.
              </p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div style={styles.actionRow}>
          <button
            style={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(0, 210, 255, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            style={styles.nextBtn}
            onClick={handleCreate}
          >
            Create
          </motion.button>
        </div>
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
    width: "700px",
    height: "700px",
    background:
      "radial-gradient(circle, rgba(0,210,255,0.05) 0%, rgba(10,15,26,0) 75%)",
    filter: "blur(100px)",
    zIndex: 0
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    padding: "40px",
    background: "rgba(15,23,42,0.5)",
    backdropFilter: "blur(20px)",
    borderRadius: "32px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
    zIndex: 1
  },
  header: { marginBottom: "30px", textAlign: "center" },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "900",
    color: "#fff",
    margin: "0 0 5px 0"
  },
  subtitle: { color: "#94a3b8", fontSize: "14px" },
  splitLayout: { display: "flex", gap: "30px", marginTop: "20px" },
  previewPanel: { flex: 1.4 },
  previewDisplay: {
    height: "220px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  previewLabel: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "2px"
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "10px"
  },
  colorCircle: {
    height: "30px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  optionsPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  optionItem: {
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  radioCircle: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid #00d2ff",
    marginRight: "12px"
  },
  radioLabel: { fontSize: "15px", fontWeight: "600" },
  infoBox: {
    marginTop: "10px",
    padding: "15px",
    background: "rgba(255,255,255,0.03)",
    color: "#64748b",
    borderRadius: "12px",
    fontSize: "12px"
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  nextBtn: {
    background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
    color: "#0a0f1a",
    padding: "16px 40px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "900"
  },
  backBtn: {
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    cursor: "pointer"
  }
};

export default CanvasBackgroundPage;
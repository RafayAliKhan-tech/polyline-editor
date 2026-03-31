import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const COLORS = [
  "#374151", "#6B7280", "#9CA3AF", "#D1D5DB",
  "#8B5CF6", "#6366F1", "#3B82F6", "#06B6D4",
  "#14B8A6", "#10B981", "#84CC16", "#FBBF24", "#F97316"
];

const CanvasBackgroundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive width & height from previous page
  const { width, height } = location.state || {};

  // Default = GRID selected
  const [mode, setMode] = useState("grid");
  const [selectedColor, setSelectedColor] = useState("#8B5CF6");

  // 👉 BACK
  const handleBack = () => {
    navigate("/canvas-select");
  };

  // 👉 CREATE
  const handleCreate = () => {
    navigate("/editor", {
      state: {
        width,
        height,
        backgroundType: mode,
        backgroundColor: selectedColor
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Pick a Background</h2>
        <p style={styles.subtitle}>Choose how your canvas looks</p>

        {/* GRID OPTION */}
        <div
          style={{
            ...styles.option,
            borderColor: mode === "grid" ? "#00d2ff" : "#333"
          }}
          onClick={() => setMode("grid")}
        >
          <input type="radio" checked={mode === "grid"} readOnly />
          <span>Grid</span>
        </div>

        {/* SOLID COLOR OPTION */}
        <div
          style={{
            ...styles.option,
            borderColor: mode === "color" ? "#00d2ff" : "#333"
          }}
          onClick={() => setMode("color")}
        >
          <input type="radio" checked={mode === "color"} readOnly />
          <span>Solid Color</span>
        </div>

        {/* 🎨 COLOR PALETTE */}
        {mode === "color" && (
          <div style={styles.palette}>
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => setSelectedColor(c)}
                style={{
                  ...styles.colorBox,
                  backgroundColor: c,
                  border:
                    selectedColor === c
                      ? "3px solid #00d2ff"
                      : "2px solid transparent"
                }}
              />
            ))}
          </div>
        )}

        {/* BUTTONS */}
        <div style={styles.buttonRow}>
          <button style={styles.backBtn} onClick={handleBack}>
            Back
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.createBtn}
            onClick={handleCreate}
          >
            Create
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CanvasBackgroundPage;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0f1a",
    color: "#fff"
  },
  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  title: { fontSize: "24px", marginBottom: "5px" },
  subtitle: { fontSize: "13px", color: "#94a3b8", marginBottom: "20px" },

  option: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid",
    marginBottom: "10px",
    cursor: "pointer"
  },

  palette: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "10px",
    marginTop: "15px"
  },

  colorBox: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px"
  },

  backBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  createBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#00d2ff",
    color: "#000",
    border: "none",
    cursor: "pointer"
  }
};
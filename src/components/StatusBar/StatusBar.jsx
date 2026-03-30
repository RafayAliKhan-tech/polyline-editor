// src/components/StatusBar/StatusBar.jsx
import React from "react";

const StatusBar = ({ mode, action, coords, zoom, snap = false }) => {
  return (
    <div style={styles.container}>
      
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <span style={styles.tag}>Mode</span>
        <span style={styles.value}>{mode}</span>

        <span style={styles.separator}>|</span>

        <span style={styles.tag}>Action</span>
        <span style={styles.value}>{action}</span>

        <span style={styles.separator}>|</span>

        <span style={styles.tag}>Snap</span>
        <span style={{ ...styles.value, color: snap ? "#22c55e" : "#ef4444" }}>
          {snap ? "ON" : "OFF"}
        </span>
      </div>

      {/* CENTER (OPTIONAL GRID INFO) */}
      <div style={styles.center}>
        <span style={styles.tag}>Grid</span>
        <span style={styles.value}>50px</span>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <span style={styles.zoom}>
          🔍 {(zoom * 100).toFixed(0)}%
        </span>

        <span style={styles.separator}>|</span>

        <span style={styles.coords}>
          X: {Math.round(coords.x)} , Y: {Math.round(coords.y)}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "34px",
    background: "#020617",
    color: "#cbd5f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px",
    borderTop: "1px solid #1e293b",
    fontSize: "12px",
    fontFamily: "monospace",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  center: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "6px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  tag: {
    color: "#64748b",
  },

  value: {
    color: "#22c55e",
    fontWeight: "500",
  },

  coords: {
    color: "#38bdf8",
    fontWeight: "500",
  },

  zoom: {
    color: "#facc15",
    fontWeight: "600",
  },

  separator: {
    margin: "0 6px",
    color: "#334155",
  },
};

export default StatusBar;
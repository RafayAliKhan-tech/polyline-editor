//src/compoenents/StatusBar/StatusBar.jsx
import React from "react";

const StatusBar = ({ mode, x = 0, y = 0 }) => {
  return (
    <div style={styles.statusBar}>
      <div style={styles.item}>MODE: <span style={styles.value}>{mode.toUpperCase()}</span></div>
      <div style={styles.item}>ACTION: <span style={styles.value}>NONE</span></div>
      <div style={styles.item}>COORDINATES: <span style={styles.value}>X: {x}, Y: {y}</span></div>
      <div style={styles.item}>STATUS: <span style={styles.value}>READY</span></div>
    </div>
  );
};

const styles = {
  statusBar: { display: "flex", padding: "6px 20px", backgroundColor: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.1)", gap: "30px", fontSize: "11px", color: "#64748b", letterSpacing: "1px" },
  item: { display: "flex", gap: "8px" },
  value: { color: "#00d2ff", fontWeight: "bold" }
};

export default StatusBar;
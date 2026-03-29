// src/components/Toolbar/Toolbar.jsx
import React from "react";
import { motion } from "framer-motion";

const Toolbar = ({ activeTool, setActiveTool }) => {
  const tools = [
    { id: "draw", label: "Draw (B)", icon: "🖋️" },
    { id: "move", label: "Move (M)", icon: "🖐️" },
    { id: "erase", label: "Delete (D)", icon: "🧹" },
    { id: "refresh", label: "Refresh (R)", icon: "🔄" },
    { id: "quit", label: "Quit (Q)", icon: "🚪" },
  ];

  const actions = ["Undo", "Redo", "Save", "Export", "Color"];

  return (
    <div style={styles.toolbar}>
      <div style={styles.section}>
        {tools.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTool(t.id)}
            style={{
              ...styles.btn,
              backgroundColor: activeTool === t.id ? "#00d2ff" : "#1e293b",
              color: activeTool === t.id ? "#0f172a" : "#fff",
            }}
          >
            {t.icon} <span style={{fontSize: '10px'}}>{t.label}</span>
          </motion.button>
        ))}
      </div>
      <div style={styles.divider}></div>
      <div style={styles.section}>
        {actions.map(action => (
          <button key={action} style={styles.actionBtn}>{action}</button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  toolbar: { display: "flex", gap: "12px", padding: "10px 20px", backgroundColor: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.1)", alignItems: "center" },
  section: { display: "flex", gap: "8px" },
  divider: { width: "1px", height: "30px", backgroundColor: "rgba(255,255,255,0.1)", margin: "0 10px" },
  btn: { padding: "8px 12px", borderRadius: "8px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", transition: "0.2s" },
  actionBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "12px" }
};

export default Toolbar;
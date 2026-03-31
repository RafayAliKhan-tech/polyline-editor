// src/components/Toolbar/Toolbar.jsx
import React from "react";
import { useEditor } from "../../context/EditorContext";
import { Box } from "lucide-react"; // icon for 3D

import {
  MousePointer2, Pencil, Move, Trash2, Plus, Hand,
  Undo2, Redo2, RotateCcw, ChevronLeft, HelpCircle
} from "lucide-react";

const Toolbar = ({ activeTool, setActiveTool, setMode, undo, redo, reset, onQuit }) => {
  const tools = [
    { id: "select", label: "Select", icon: <MousePointer2 size={18} />, mode: "SELECT" },
    { id: "draw", label: "Draw", icon: <Pencil size={18} />, mode: "DRAW" },
    { id: "move", label: "Move", icon: <Move size={18} />, mode: "MOVE" },
    { id: "delete", label: "Delete", icon: <Trash2 size={18} />, mode: "DELETE" },
    { id: "insert", label: "Insert", icon: <Plus size={18} />, mode: "INSERT" },
    { id: "pan", label: "Pan", icon: <Hand size={18} />, mode: "PAN" },
  ];
  
const { mode: viewMode, setMode: setViewMode, MODES } = useEditor();
  return (
    <div style={styles.sidebar}>
      {/* Top Section: Back, Tools, Actions */}
      <div style={styles.topSection}>
        <button onClick={onQuit} style={styles.backBtn}>
          <ChevronLeft size={16} /> Back
        </button>

        <div style={styles.toolsList}>
          {tools.map((t) => (
            <div
              key={t.id}
              onClick={() => { setActiveTool(t.id); setMode(t.mode); }}
              style={{
                ...styles.toolWrapper,
                background: activeTool === t.id ? "rgba(74, 222, 128, 0.15)" : "transparent"
              }}
            >
              <div style={{ color: activeTool === t.id ? "#4ade80" : "#909296" }}>{t.icon}</div>
              <div style={{ ...styles.label, color: activeTool === t.id ? "#fff" : "#909296" }}>{t.label}</div>
              {activeTool === t.id && <div style={styles.activeIndicator} />}
            </div>
          ))}
        </div>

        <div style={styles.divider} />

        <div style={styles.actionGroup}>
          {/* Existing buttons */}
          <button onClick={undo} style={styles.smallBtn} title="Undo">
            <Undo2 size={16} />
          </button>

          <button onClick={redo} style={styles.smallBtn} title="Redo">
            <Redo2 size={16} />
          </button>

          <button onClick={reset} style={styles.smallBtn} title="Reset">
            <RotateCcw size={16} />
          </button>


          {/* 🔵 3D Preview Toggle */}
          {viewMode === MODES.EDIT_2D && (
            <button
              type="button"   // ✅ prevent accidental form submission
              onClick={() => setViewMode(MODES.PREVIEW_3D)}
              style={styles.smallBtn}
              title="3D Preview"
            >
              <Box size={16} />
            </button>
          )}

          {viewMode === MODES.PREVIEW_3D && (
            <button
              type="button"
              onClick={() => setViewMode(MODES.EDIT_2D)}
              style={styles.smallBtn}
              title="Back to 2D"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Section: Guide */}
      <div style={styles.bottomSection}>
        <div style={styles.guideBox}>
          <HelpCircle size={18} color="#909296" />
          <span style={styles.guideLabel}>Guide</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "70px", background: "#1a1b1e", display: "flex", flexDirection: "column",
    justifyContent: "space-between", alignItems: "center", borderRight: "1px solid #373a40",
    height: "100vh", boxSizing: "border-box", overflow: "hidden"
  },
  topSection: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
  backBtn: {
    background: "transparent", border: "none", color: "#909296", padding: "15px 0",
    fontSize: "11px", cursor: "pointer", width: "100%", borderBottom: "1px solid #373a40",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px'
  },
  toolsList: { width: "100%", marginTop: '5px' },
  toolWrapper: {
    width: "100%", padding: "10px 0", display: "flex", flexDirection: "column",
    alignItems: "center", cursor: "pointer", position: "relative"
  },
  label: { fontSize: "10px", marginTop: "4px" },
  activeIndicator: {
    position: "absolute", left: 0, top: "15%", bottom: "15%", width: "3px",
    background: "#4ade80", borderRadius: "0 4px 4px 0"
  },
  divider: { width: "40%", height: "1px", background: "#373a40", margin: "12px 0" },
  actionGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  smallBtn: {
    background: "#2c2e33", border: "1px solid #3d4047", color: "#fff",
    width: "34px", height: "34px", borderRadius: "8px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  bottomSection: { paddingBottom: "15px" },
  guideBox: {
    width: "42px", height: "50px", background: "#2c2e33", border: "1px solid #3d4047",
    borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", cursor: "pointer", gap: "2px"
  },
  guideLabel: { fontSize: "9px", color: "#909296" }
};

export default Toolbar;
//src/components/TopBar/TopBar.jsx
import React from "react";
import { Save, FolderOpen, FileCode, Box } from "lucide-react";

const TopBar = ({ zoom, saveToFile, loadFromFile, exportSVG, exportOBJ }) => {
  const fileInputRef = React.useRef(null);

  return (
    <div style={styles.topBar}>
      {/* Left Side: Zoom Info (Screenshot jaisa) */}
      <div style={styles.section}>
        <span style={styles.zoomText}>Zoom: {(zoom * 100).toFixed(0)}%</span>
      </div>

      {/* Right Side: File Actions */}
      <div style={styles.section}>
        <button onClick={saveToFile} style={styles.actionBtn} title="Save">
          <Save size={16} /> <span>Save</span>
        </button>

        <button onClick={() => fileInputRef.current.click()} style={styles.actionBtn} title="Open">
          <FolderOpen size={16} /> <span>Open</span>
        </button>
        <input type="file" hidden ref={fileInputRef} onChange={(e) => loadFromFile(e.target.files[0])} />

        <div style={styles.divider} />

        <button onClick={exportSVG} style={styles.exportBtn}>
          <FileCode size={14} /> SVG
        </button>
        <button onClick={exportOBJ} style={styles.exportBtn}>
          <Box size={14} /> OBJ
        </button>
      </div>
    </div>
  );
};

const styles = {
  topBar: {
    height: "45px",
    background: "#1e1f23",
    borderBottom: "1px solid #373a40",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "#909296",
  },
  section: { display: "flex", alignItems: "center", gap: "15px" },
  zoomText: { fontSize: "13px", fontWeight: "500" },
  actionBtn: {
    background: "transparent",
    border: "none",
    color: "#ececec",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontSize: "13px",
    padding: "5px 10px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  exportBtn: {
    background: "#2c2e33",
    border: "1px solid #3d4047",
    color: "#4ade80",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  },
  divider: { width: "1px", height: "20px", background: "#373a40", margin: "0 10px" },
};

export default TopBar;
import { createContext, useContext, useState } from "react";

// Create context
const EditorContext = createContext();

// Modes
const MODES = {
  EDIT_2D: "EDIT_2D",
  PREVIEW_3D: "PREVIEW_3D",
};

// Provider component
export function EditorProvider({ children }) {
  const [mode, setMode] = useState(MODES.EDIT_2D);

  // This will store all drawn polylines
  const [polylines, setPolylines] = useState([]);

  return (
    <EditorContext.Provider
      value={{
        mode,
        setMode,
        polylines,
        setPolylines,
        MODES,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

// Custom hook (easy access)
export function useEditor() {
  return useContext(EditorContext);
}
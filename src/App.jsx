// src/App.jsx
import React from "react";
import AppRoutes from "./routes/appRoutes";
import { useEditor } from "./context/EditorContext";

function App() {
  const { mode, setMode } = useEditor();

  return  (
    <>
      <AppRoutes />
    </>
  ); 
}

export default App;

//npx vite --host
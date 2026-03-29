//src/routes/appRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreenPage from "../screens/SplashScreenPage";
import CanvasSelectionPage from "../screens/CanvasSelectionPage";
import CanvasEditorPage from "../screens/CanvasEditorPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreenPage />} />
      <Route path="/canvas-select" element={<CanvasSelectionPage />} />
      <Route path="/editor" element={<CanvasEditorPage />} />
    </Routes>
  );
};

export default AppRoutes;
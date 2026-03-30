//src/routes/appRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreenPage from "../screens/SplashScreenPage";
import CanvasSelectionPage from "../screens/CanvasSelectionPage";
// import CanvasEditorPage from "../screens/CanvasEditorPage";
import Canvas2DPage from "../screens/Editor2D";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreenPage />} />
      <Route path="/canvas-select" element={<CanvasSelectionPage />} />
      <Route path="/2d" element={<Canvas2DPage />} />
    </Routes>
  );
};

export default AppRoutes;
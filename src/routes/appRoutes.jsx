//src/routes/appRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreenPage from "../screens/SplashScreenPage";
import CanvasSelectionPage from "../screens/CanvasSelectionPage";
import Canvas2DPage from "../screens/Editor2D";
import CanvasBackgroundPage from "../screens/CanvasBackgroundPage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreenPage />} />
      <Route path="/canvas-select" element={<CanvasSelectionPage />} />
      <Route path="/canvas-background" element={<CanvasBackgroundPage />} />
      {/* <Route path="/editor" element={<Editor2D />} /> */}
      <Route path="/editor" element={<Canvas2DPage />} />
    </Routes>
  );
};

export default AppRoutes;
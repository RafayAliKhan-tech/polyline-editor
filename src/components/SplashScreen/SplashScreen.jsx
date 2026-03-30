//src/components/SplashScreen/SplashScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Lottie Load karna
    fetch("/splash.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Lottie Error:", err));

    // 4 seconds baad auto-navigate (User ko animation enjoy karne dein)
    const timer = setTimeout(() => navigate("/canvas-select"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Background Decorative Glow */}
      <div style={styles.bgGlow}></div>

      {/* Lottie Animation Layer */}
      <AnimatePresence>
        {animationData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={styles.lottieWrapper}
          >
            <Lottie animationData={animationData} loop={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layer */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        style={styles.content}
      >
        <h1 style={styles.logoText}>
          Polyline<span style={{ color: "#00d2ff" }}>Editor</span>
        </h1>
        <p style={styles.subtitle}>Precision. Efficiency. Simplicity.</p>

        {/* Dynamic Progress Bar */}
        <div style={styles.loaderTrack}>
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.8, ease: "linear" }}
            style={styles.loaderFill}
          />
        </div>
      </motion.div>

      {/* Modern Glassmorphic Skip Button */}
      <motion.button 
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        whileTap={{ scale: 0.95 }}
        style={styles.skipBtn} 
        onClick={() => navigate("/canvas-select")}
      >
        Skip Intro
      </motion.button>

      {/* Footer Branding */}
      <div style={styles.footer}>v1.0.4 • Powered by React</div>
    </div>
  );
};

// --- Styles (JSS) ---
const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100%",
    backgroundColor: "#0a0f1a", // Deep Midnight Blue
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  bgGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(0, 210, 255, 0.1) 0%, rgba(10, 15, 26, 0) 70%)",
    borderRadius: "50%",
    filter: "blur(60px)",
    zIndex: 0,
  },
  lottieWrapper: {
    position: "absolute",
    width: "70%",
    maxWidth: "700px",
    zIndex: 1,
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
  },
  logoText: {
    fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: "-2px",
    margin: 0,
    textShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#94a3b8",
    marginTop: "12px",
    fontWeight: "300",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  loaderTrack: {
    width: "220px",
    height: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    margin: "40px auto 0",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  loaderFill: {
    height: "100%",
    background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
    boxShadow: "0 0 15px rgba(0, 210, 255, 0.6)",
  },
  skipBtn: {
    position: "absolute",
    bottom: "50px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "100px",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    zIndex: 3,
    transition: "all 0.3s ease",
  },
  footer: {
    position: "absolute",
    bottom: "20px",
    fontSize: "11px",
    color: "#475569",
    letterSpacing: "0.5px",
  }
};

export default SplashScreen;
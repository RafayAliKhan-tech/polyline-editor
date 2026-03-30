//src/hooks/useKeyboard.js
import { useEffect } from "react";

export default function useKeyboard(handler) {
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
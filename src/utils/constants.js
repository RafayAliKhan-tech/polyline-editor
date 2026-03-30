// // src/utils/constants.js
export const MODES = {
  IDLE: "IDLE",
  DRAW: "DRAW",    // B Key
  MOVE: "MOVE",    // M Key
  DELETE: "DELETE",// D Key
  INSERT: "INSERT" // I Key
};

export const CANVAS = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600,
  MIN_WIDTH: 400,
  MAX_WIDTH: 1920,
};

export const THRESHOLD = {
  VERTEX: 12, // px for snapping
  LINE: 10 // ✅ IMPORTANT FIX
};

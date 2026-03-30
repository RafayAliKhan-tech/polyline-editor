//src/utils/helpers.js
// Snap to grid (optional feature)
export function snapToGrid(value, gridSize = 10) {
  return Math.round(value / gridSize) * gridSize;
}

// Clamp value (useful for bounds)
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
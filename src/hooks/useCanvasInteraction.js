//src/hooks/useCanvasInteraction.js
import { useEffect, useRef } from "react";

export default function useCanvasInteraction({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDoubleClick,
}) {
  const isDownRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e) => {
      isDownRef.current = true;
      handleMouseDown?.(e);
    };

    const onMouseMove = (e) => {
      handleMouseMove?.(e);
    };

    const onMouseUp = (e) => {
      isDownRef.current = false;
      handleMouseUp?.(e);
    };

    const onDoubleClick = (e) => {
      handleDoubleClick?.(e);
    };

    const onContextMenu = (e) => {
      e.preventDefault();
      handleMouseDown?.(e);
    };

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      isDownRef.current = true;
      handleMouseDown?.(touch);
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      handleMouseMove?.(touch);
    };

    const onTouchEnd = () => {
      isDownRef.current = false;
      handleMouseUp?.();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("dblclick", onDoubleClick);
    canvas.addEventListener("contextmenu", onContextMenu);

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    const onWindowMouseUp = () => {
      isDownRef.current = false;
      handleMouseUp?.();
    };

    window.addEventListener("mouseup", onWindowMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("dblclick", onDoubleClick);
      canvas.removeEventListener("contextmenu", onContextMenu);

      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);

      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleDoubleClick]);
}
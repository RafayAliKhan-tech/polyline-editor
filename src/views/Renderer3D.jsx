// src/views/Renderer3D.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Renderer3D = ({ polylines = [] }) => {
  const containerRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const lineGroupRef = useRef(null);
  const animationRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ===== SCENE =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;

    // ===== CAMERA =====
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // ===== RENDERER =====
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== LIGHT =====
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // ===== GRID + AXES =====
    scene.add(new THREE.GridHelper(50, 50));
    scene.add(new THREE.AxesHelper(5));

    // ===== LINE GROUP =====
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);
    lineGroupRef.current = lineGroup;

    // ===== SAFE GET VERTICES =====
    const getVertices = (poly) => {
      if (!poly) return [];

      if (typeof poly.getVertices === "function") return poly.getVertices();
      if (Array.isArray(poly.vertices)) return poly.vertices;
      if (Array.isArray(poly.points)) return poly.points;

      return [];
    };

    // ===== DRAW FUNCTION =====
    const drawPolylines = () => {
      // cleanup old lines
      while (lineGroup.children.length > 0) {
        const obj = lineGroup.children[0];
        lineGroup.remove(obj);
        obj.geometry?.dispose();
        obj.material?.dispose();
      }

      polylines.forEach((poly) => {
        const verts = getVertices(poly);
        if (!verts || verts.length < 2) return;

        const points = verts.map(
          (v) =>
            new THREE.Vector3(
              (v.x || 0) / 50,
              -(v.y || 0) / 50,
              (v.z || 0) / 50
            )
        );

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({
          color: 0x00ff88,
        });

        const line = new THREE.Line(geometry, material);
        lineGroup.add(line);
      });
    };

    // ===== CONTROLS =====
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;

      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(2, Math.min(50, camera.position.z));
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel);

    // ===== ANIMATION LOOP =====
    const animate = () => {
      drawPolylines();

      lineGroup.rotation.x = rotationRef.current.x;
      lineGroup.rotation.y = rotationRef.current.y;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ===== RESIZE =====
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ===== CLEANUP =====
    return () => {
      cancelAnimationFrame(animationRef.current);

      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);

      lineGroup.children.forEach((obj) => {
        obj.geometry?.dispose();
        obj.material?.dispose();
      });

      scene.clear();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      window.removeEventListener("resize", handleResize);
    };
  }, [polylines]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#111",
      }}
    />
  );
};

export default Renderer3D;
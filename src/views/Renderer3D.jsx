// src/views/Renderer3D.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Renderer3D = ({ polylines = [] }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshGroupRef = useRef(null);
  const animationRef = useRef(null);

  const rotationRef = useRef({ x: 0.5, y: 0.5 }); // Thora initial angle
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // HELPERS
  const getVertices = (poly) => {
    if (!poly) return [];
    if (typeof poly.getVertices === "function") return poly.getVertices();
    if (Array.isArray(poly.vertices)) return poly.vertices;
    return [];
  };

  const createMaterial = (color = 0x00ff88) =>
    new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.6,
      roughness: 0.3,
      side: THREE.DoubleSide, // Dono sides nazar ayengi
    });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 40); // Thora peechay camera
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(10, 20, 15);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x4ade80, 0.5);
    fillLight.position.set(-15, -10, 10);
    scene.add(fillLight);

    // MESH GROUP
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // GRID
    const grid = new THREE.GridHelper(100, 50, 0x333333, 0x222222);
    grid.rotation.x = Math.PI / 2; // Flat grid
    scene.add(grid);

    // CONTROLS LOGIC
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      rotationRef.current.y += dx * 0.01;
      rotationRef.current.x += dy * 0.01;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDraggingRef.current = false);
    const onWheel = (e) => {
      camera.position.z += e.deltaY * 0.05;
      camera.position.z = Math.max(10, Math.min(200, camera.position.z));
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel);

    // ANIMATION
    const animate = () => {
      // Smooth rotation based on dragging
      meshGroup.rotation.x += (rotationRef.current.x - meshGroup.rotation.x) * 0.1;
      meshGroup.rotation.y += (rotationRef.current.y - meshGroup.rotation.y) * 0.1;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // RESIZE
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // SEPARATE EFFECT FOR UPDATING MESHES (Only when polylines change)
  useEffect(() => {
    if (!meshGroupRef.current) return;
    const meshGroup = meshGroupRef.current;

    // Cleanup old meshes
    while (meshGroup.children.length > 0) {
      const obj = meshGroup.children;
      meshGroup.remove(obj);
      obj.geometry?.dispose();
      obj.material?.dispose();
    }

    // Draw new ones
    polylines.forEach((poly) => {
      const verts = getVertices(poly);
      if (verts.length < 3) return; // Need at least 3 points for a shape

      // Scale to fit 3D space
      const scale = 0.1;
      const shapePoints = verts.map(v => new THREE.Vector2(v.x * scale, -v.y * scale));
      
      const shape = new THREE.Shape(shapePoints);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 3, // Block thickness
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
      });

      // Center geometry
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      const mesh = new THREE.Mesh(geometry, createMaterial(verts.color));
      meshGroup.add(mesh);
    });
  }, [polylines]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#000" }} />
  );
};

export default Renderer3D;
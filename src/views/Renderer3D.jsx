// src/views/Renderer3D.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Renderer3D = ({ polylines = [] }) => {
  const containerRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshGroupRef = useRef(null);
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
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    // ===== RENDERER =====
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== LIGHTS (IMPROVED) =====
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffffff, 1);
    keyLight.position.set(10, 10, 10);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.5);
    fillLight.position.set(-10, -10, -10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // ===== GRID + AXES =====
    scene.add(new THREE.GridHelper(50, 50));
    scene.add(new THREE.AxesHelper(5));

    // ===== MESH GROUP =====
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // ===== HELPERS =====
    const getVertices = (poly) => {
      if (!poly) return [];
      if (typeof poly.getVertices === "function") return poly.getVertices();
      if (Array.isArray(poly.vertices)) return poly.vertices;
      if (Array.isArray(poly.points)) return poly.points;
      return [];
    };

    const createMaterial = () =>
      new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.6,
        roughness: 0.25,
      });

    const centerGeometry = (geometry) => {
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);
    };

    const isRectangle = (verts) => {
      if (verts.length !== 4) return false;

      const dx1 = Math.abs(verts[0].x - verts[1].x);
      const dy1 = Math.abs(verts[0].y - verts[1].y);
      const dx2 = Math.abs(verts[1].x - verts[2].x);
      const dy2 = Math.abs(verts[1].y - verts[2].y);

      return (dx1 === 0 || dy1 === 0) && (dx2 === 0 || dy2 === 0);
    };

    const isCircle = (verts) => {
      if (verts.length < 6) return false;

      let cx = 0,
        cy = 0;
      verts.forEach((v) => {
        cx += v.x;
        cy += v.y;
      });
      cx /= verts.length;
      cy /= verts.length;

      const distances = verts.map((v) =>
        Math.hypot(v.x - cx, v.y - cy)
      );

      const avg =
        distances.reduce((a, b) => a + b, 0) / distances.length;

      return distances.every((d) => Math.abs(d - avg) < avg * 0.2);
    };

    // ===== DRAW FUNCTION =====
    const drawPolylines = () => {
      while (meshGroup.children.length > 0) {
        const obj = meshGroup.children[0];
        meshGroup.remove(obj);
        obj.geometry?.dispose();
        obj.material?.dispose();
      }

      polylines.forEach((poly) => {
        const verts = getVertices(poly);
        if (!verts || verts.length < 2) return;

        let geometry;

        // RECTANGLE → BOX
        if (isRectangle(verts)) {
          const width = Math.abs(verts[0].x - verts[1].x) / 50 || 1;
          const height = Math.abs(verts[1].y - verts[2].y) / 50 || 1;
          const depth = 3;

          geometry = new THREE.BoxGeometry(width, height, depth);
        }

        // CIRCLE → CYLINDER
        else if (isCircle(verts)) {
          let cx = 0,
            cy = 0;
          verts.forEach((v) => {
            cx += v.x;
            cy += v.y;
          });
          cx /= verts.length;
          cy /= verts.length;

          const radius =
            Math.hypot(verts[0].x - cx, verts[0].y - cy) / 50;

          geometry = new THREE.CylinderGeometry(radius, radius, 3, 32);
        }

        // FALLBACK → EXTRUDE
        else {
          const shapePoints = verts.map(
            (v) =>
              new THREE.Vector2(
                (v.x || 0) / 50,
                -(v.y || 0) / 50
              )
          );

          const shape = new THREE.Shape(shapePoints);

          geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 2,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2,
          });
        }

        // Center geometry
        centerGeometry(geometry);

        const mesh = new THREE.Mesh(geometry, createMaterial());

        // ===== EDGE OUTLINES =====
        // const edges = new THREE.EdgesGeometry(geometry);
        // const edgeLines = new THREE.LineSegments(
        //   edges,
        //   new THREE.LineBasicMaterial({ color: 0xffffff })
        // );
        // mesh.add(edgeLines);

        meshGroup.add(mesh);
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
      camera.position.z += e.deltaY * 0.05;
      camera.position.z = Math.max(5, Math.min(100, camera.position.z));
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel);

    // ===== ANIMATION =====
    const animate = () => {
      drawPolylines();

      // SMOOTH ROTATION
      meshGroup.rotation.x +=
        (rotationRef.current.x - meshGroup.rotation.x) * 0.1;
      meshGroup.rotation.y +=
        (rotationRef.current.y - meshGroup.rotation.y) * 0.1;

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

      meshGroup.children.forEach((obj) => {
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
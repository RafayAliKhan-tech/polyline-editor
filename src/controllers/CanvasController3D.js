//src/controllers/CanvasController3D.js
import { useState, useEffect } from "react";
import * as THREE from "three";
import Polyline3D from "../models/Polyline3D";
import { distance3D } from "../utils/math";

export default function useCanvasController3D(containerRef) {
  // ---------- STATE ----------
  const [polylines, setPolylines] = useState([]);
  const [currentPolyline, setCurrentPolyline] = useState(null);
  const [mode, setMode] = useState("IDLE"); // IDLE / DRAW / MOVE / DELETE
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const THRESHOLD = 0.2; // world units for selection

  // ---------- THREE.js SETUP ----------
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true }));

  useEffect(() => {
    if (!containerRef.current) return;

    const { clientWidth: width, clientHeight: height } = containerRef.current;

    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [containerRef, renderer, camera, scene]);

  // ---------- KEYBOARD HANDLERS ----------
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toUpperCase()) {
        case "B":
          setMode("DRAW");
          setCurrentPolyline(new Polyline3D());
          break;
        case "M":
          setMode("MOVE");
          setCurrentPolyline(null);
          break;
        case "D":
          setMode("DELETE");
          setCurrentPolyline(null);
          break;
        case "R":
          setPolylines([]);
          setCurrentPolyline(null);
          setSelectedVertex(null);
          setIsDragging(false);
          scene.clear();
          break;
        case "Q":
          window.close();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scene]);

  // ---------- MOUSE HANDLERS ----------
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const getMouseWorld = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersect);
    return intersect;
  };

  const handleMouseDown = (e) => {
    const worldPos = getMouseWorld(e);

    if (mode === "DRAW") {
      if (!currentPolyline) {
        const polyline = new Polyline3D();
        polyline.addVertex(worldPos.x, worldPos.y, worldPos.z);
        setCurrentPolyline(polyline);
        setPolylines([...polylines, polyline]);
      } else {
        currentPolyline.addVertex(worldPos.x, worldPos.y, worldPos.z);
        setPolylines([...polylines]);
      }
    } else if (mode === "MOVE") {
      const vertex = findNearestVertex(worldPos);
      if (vertex) {
        setSelectedVertex(vertex);
        setIsDragging(true);
      }
    } else if (mode === "DELETE") {
      const vertex = findNearestVertex(worldPos);
      if (vertex) {
        for (const poly of polylines) {
          poly.removeVertex(vertex);
        }
        setPolylines([...polylines]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedVertex) return;
    const worldPos = getMouseWorld(e);

    selectedVertex.x = worldPos.x;
    selectedVertex.y = worldPos.y;
    selectedVertex.z = worldPos.z;

    setPolylines([...polylines]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedVertex(null);
  };

  // ---------- UTILITY ----------
  const findNearestVertex = (pos) => {
    let nearest = null;
    let minDist = Infinity;

    for (const poly of polylines) {
      const vertices = poly.getVertices();
      for (const v of vertices) {
        const d = distance3D(v.x, v.y, v.z, pos.x, pos.y, pos.z);
        if (d < minDist && d <= THRESHOLD) {
          minDist = d;
          nearest = v;
        }
      }
    }
    return nearest;
  };

  return {
    polylines,
    mode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    scene,
    camera,
    renderer,
  };
}
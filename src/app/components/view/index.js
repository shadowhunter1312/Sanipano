import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function PanoramaScene({ cubeImages }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const skyboxRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0xffffff);

    // Create Camera
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Slightly forward to prevent clipping
    cameraRef.current = camera;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;

    // ✅ Set the initial camera target to rotate the view
    controls.target.set(0.01, -0.2, -1); // Look towards X=10 for an initial rotated view
    controls.update();
    controlsRef.current = controls;

    // Add Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    // Load Skybox
    const loadSkybox = () => {
      const materials = cubeImages.map((image) =>
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(image),
          side: THREE.BackSide,
        })
      );

      if (skyboxRef.current) scene.remove(skyboxRef.current);

      const skybox = new THREE.Mesh(new THREE.BoxGeometry(60, 60, 60), materials);
      skyboxRef.current = skybox;
      scene.add(skybox);
    };

    loadSkybox();

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (skyboxRef.current) {
      skyboxRef.current.material.forEach((mat, index) => {
        mat.map = new THREE.TextureLoader().load(cubeImages[index]);
        mat.needsUpdate = true;
      });
    }
  }, [cubeImages]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}

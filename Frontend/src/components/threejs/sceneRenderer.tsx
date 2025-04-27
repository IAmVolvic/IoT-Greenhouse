import * as THREE from "three";

export const sceneRenderer = () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow maps in renderer
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: soft shadows

    return renderer
};
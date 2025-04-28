import * as THREE from "three";

export const sceneCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 5, 7);
    return camera
};
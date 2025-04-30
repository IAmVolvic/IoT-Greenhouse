import * as THREE from "three";

export const sceneLight = () => {
    const directionalLight = new THREE.DirectionalLight( "#fcfcdd", 2 );
    directionalLight.position.set( 3, 5, -3 ).multiplyScalar( 3 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048); // Increase shadow resolution
    directionalLight.shadow.camera.near = 0.5; // Near plane of the shadow camera
    directionalLight.shadow.camera.far = 50; // Far plane of the shadow camera
    directionalLight.shadow.bias = -0.005; // Adjust bias to avoid shadow acne
    
    return directionalLight
};
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const sceneControls = (camera, renderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Disable panning, allow zoom and rotation
    controls.screenSpacePanning = false;  // Disable screen-space panning (this also affects drag)
    controls.enablePan = false;           // Disable panning completely
    controls.enableZoom = true;           // Enable zoom
    controls.enableRotate = true;         // Enable rotation
    
    controls.minDistance = 5;             // Minimum zoom distance
    controls.maxDistance = 10;            // Maximum zoom distance

    return controls
};
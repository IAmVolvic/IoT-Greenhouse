import * as THREE from "three";

export const baseScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#171a26');
    scene.fog = new THREE.Fog( '#171a26', 15, 35 );
    
    return scene
};
import * as THREE from "three";

export const sceneGrid = () => {
    const grid = new THREE.GridHelper(100, 50, "#5d678c", "#383f59");
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.position.y = -0.015;

    return grid;
};
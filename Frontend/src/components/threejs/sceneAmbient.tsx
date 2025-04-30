import * as THREE from "three";

export const sceneAmbient = () => {
    const ambient = new THREE.HemisphereLight( 0xffffff, 0xbfd4d2, 3 );
    return ambient
};
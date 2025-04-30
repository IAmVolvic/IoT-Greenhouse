import * as THREE from "three";

export const sceneFloor = () => {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        new THREE.ShadowMaterial({
            color: "0xd81b60",
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
        })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.01;
    plane.scale.setScalar(1000);
    plane.receiveShadow = true;

    return plane;
};
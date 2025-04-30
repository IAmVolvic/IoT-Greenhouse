import * as THREE from 'three';
import { FBXLoader } from 'three-stdlib';


export const floorPlanFbx = (): Promise<THREE.Group> => {
    const loader = new FBXLoader();
    
    return new Promise((resolve, reject) => {
        loader.load('/assets/OBJ/Floorplan.fbx', (object) => {
            object.scale.set(0.001, 0.001, 0.001);
            object.position.z = -1.5;

            object.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;

                    if (mesh.name === "Windows") {
                        mesh.material = new THREE.MeshStandardMaterial({
                            color: "#fcfcdd",
                            transparent: true,
                            opacity: 0.2,
                        });
                        mesh.castShadow = false;
                        mesh.receiveShadow = false;

                    } else {
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                    }

                    mesh.material.side = THREE.DoubleSide;
                }
            });

            resolve(object);
        }, undefined, reject);
    });
};
import * as THREE from "three";
import { FBXLoader } from "three-stdlib";

export const floorPlanFbx = (): Promise<THREE.Group> => {
    const loader = new FBXLoader();

    return new Promise((resolve, reject) => {
        loader.load('/assets/OBJ/Floorplan.fbx', (object) => {
            object.scale.set(0.001, 0.001, 0.001);
            object.rotation.x = 0;
            object.rotation.y = 0;
            object.position.z = -1.5;

            object.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    mesh.material.side = THREE.DoubleSide;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                }
            });

            resolve(object);
            },
            undefined,
            (error) => {
                reject(error); // ❌ if failed
            }
        );
    });
};
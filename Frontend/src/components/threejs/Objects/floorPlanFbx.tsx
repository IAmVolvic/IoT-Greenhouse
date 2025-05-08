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

export class FloorPlan {
    public object: THREE.Group;
    private isReady: boolean = false;

    constructor() {
        this.object = new THREE.Group(); // Placeholder
    }

    async load(): Promise<this> {
        this.object = await floorPlanFbx();
        this.isReady = true;
        return this;
    }

    updateGreenhouseVisual(isSelected: boolean) {
        if (!this.isReady) {
            console.warn("Model not loaded yet.");
            return;
        }

        const selectedColor = new THREE.Color("#FFFFFF");
        const nonSelectedColor = new THREE.Color("#5d5d5d");

        if (isSelected) {
            this.object.scale.set(0.001, 0.001, 0.001);
        } else {
            this.object.scale.set(0.0008, 0.0008, 0.0008);
        }

        this.object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                if (mesh.name === "Windows") {
                    if (isSelected) {
                        mesh.material = new THREE.MeshStandardMaterial({
                            color: "#fcfcdd",
                            transparent: true,
                            opacity: 0.2,
                        });
                    } else {
                        mesh.material = new THREE.MeshStandardMaterial({
                            color: "#0000",
                            transparent: true,
                            opacity: 0.2,
                        });
                    }
                    mesh.material.needsUpdate = true;
                    return; // Skip the rest
                }
                

                // Handle non-window meshes
                const color = isSelected ? selectedColor : nonSelectedColor;
                const finalColor = new THREE.Color(color.r, color.g, color.b);

                if (!Array.isArray(mesh.material)) {
                    mesh.material.color = finalColor;
                    mesh.material.needsUpdate = true;
                } else {
                    // Handle array of materials
                    mesh.material.forEach(mat => {
                        mat.color = finalColor;
                        mat.needsUpdate = true;
                    });
                }
            }
        });
    }
}
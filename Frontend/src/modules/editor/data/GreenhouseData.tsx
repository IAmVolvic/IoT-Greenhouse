import * as THREE from "three";

// Define a type for our greenhouse data
interface GreenHouseData {
    id: string;
    name: string;
    position: THREE.Vector3;
    labelPosition: THREE.Vector3;
}

export const greenHouseTable: GreenHouseData[] = [
    { 
        id: "gh1", 
        name: "Greenhouse 1",
        position: new THREE.Vector3(0, 0, 0),
        labelPosition: new THREE.Vector3(0, 2.5, -2.7)
    },
    { 
        id: "gh2", 
        name: "Greenhouse 2",
        position: new THREE.Vector3(10, 0, 0),
        labelPosition: new THREE.Vector3(10, 2.5, -2.7)
    },
    { 
        id: "gh3", 
        name: "Greenhouse 3",
        position: new THREE.Vector3(20, 0, 0),
        labelPosition: new THREE.Vector3(20, 2.5, -2.7)
    },
    { 
        id: "gh4", 
        name: "Greenhouse 4",
        position: new THREE.Vector3(30, 0, 0),
        labelPosition: new THREE.Vector3(30, 2.5, -2.7)
    }
];
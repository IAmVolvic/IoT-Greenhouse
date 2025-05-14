import { AlarmSmoke, LucideIcon, Sun, Thermometer } from "lucide-react";
import * as THREE from "three";

// Define a type for our greenhouse data
interface GreenHouseData {
    id: string;
    name: string;
    position: THREE.Vector3;
    labelPosition: THREE.Vector3;
    SensorInfo: SensorInfo[];
}

interface SensorInfo {
    name: string;
    value: number;
    position: THREE.Vector3;
    icon: LucideIcon;
}

export const greenHouseTable: GreenHouseData[] = [
    { 
        id: "gh1", 
        name: "Greenhouse 1",
        position: new THREE.Vector3(0, 0, 0),
        labelPosition: new THREE.Vector3(0, 2.5, -2.7),
        SensorInfo: [
            {
                name: "gas",
                value: 0,
                position: new THREE.Vector3(0, 1, -1.5),
                icon: AlarmSmoke
            },
            {
                name: "temperature",
                value: 0,
                position: new THREE.Vector3(0, 1, 0),
                icon: Thermometer
            },
            {
                name: "light",
                value: 0,
                position: new THREE.Vector3(0, 1, 1.5),
                icon: Sun
            },
        ]
    }
];
import * as THREE from "three";
import { main } from "@assets/tailwind/pallet";

export const baseScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(main.secondary);
    scene.fog = new THREE.Fog( '#171a26', 15, 35 );
    
    return scene
};
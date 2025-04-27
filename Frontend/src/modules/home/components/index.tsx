import { useEffect, useRef } from "react";
import * as THREE from "three";
import { baseScene } from "@components/threejs/baseScene";
import { sceneCamera } from "@components/threejs/sceneCamera";
import { sceneRenderer } from "@components/threejs/sceneRenderer";
import { sceneControls } from "@components/threejs/sceneControls";
import { sceneAmbient } from "@components/threejs/sceneAmbient";
import { sceneLight } from "@components/threejs/sceneLight";
import { floorPlanFbx } from "@components/threejs/Objects/floorPlanFbx";
import { LeafyGreen } from "lucide-react";
import { sceneGrid } from "@components/threejs/Objects/sceneGrid";
import { sceneFloor } from "@components/threejs/Objects/sceneFloor";

export const Home = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    // Three.js scene setup
    const scene = baseScene();
    const camera = sceneCamera();
    const renderer = sceneRenderer();
    const controls = sceneControls(camera, renderer);
    const ambient = sceneAmbient();
    const directionalLight = sceneLight();
    const grid = sceneGrid();
    const plane = sceneFloor();

    const objectGroup = new THREE.Group();
    const worldGroup = new THREE.Group();

    const labelPosition = new THREE.Vector3(0, 2.5, -3);

    const handleClick = () => {
        console.log("Clicked the HTML Billboard!");
    }

    useEffect(() => {
        let animationId: number;

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        objectGroup.add ( grid );
        objectGroup.add ( plane );
        floorPlanFbx().then((object) => {
            objectGroup.add ( object );
        });

        worldGroup.add ( ambient );
        worldGroup.add ( directionalLight );

        scene.add(objectGroup);
        scene.add(worldGroup);


        // Main animation loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);

            if (labelRef.current) {
                const vector = labelPosition.clone().project(camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
                labelRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            }
        };
        animate();

        // Resize helper
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => {
            window.removeEventListener("resize", handleResize);

            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }

            // Cancel animation loop
            cancelAnimationFrame(animationId);

            // Remove objects from scene
            scene.remove(objectGroup);
            scene.remove(worldGroup);

            worldGroup.traverse((child) => {
                if (child instanceof THREE.Light) {
                    if (child.shadow?.map) child.shadow.map.dispose();
                }
            });

            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className="w-full h-full relative overflow-hidden">
            {/* HTML Billboard */}
            <div 
                ref={labelRef} 
                className="absolute pointer-events-auto cursor-pointer" 
                style={{ top: 0, left: 0 }}
                onClick={handleClick}
            >
                <div className="bg-light100 p-2 rounded-lg shadow-md flex items-center space-x-2">
                    <LeafyGreen className="w-6 h-6 text-green-600" />
                    <span>Room 1</span>
                </div>
            </div>
        </div>
    );
};
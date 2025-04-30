import { useEffect, useRef } from "react";
import * as THREE from "three";
import { baseScene } from "@components/threejs/baseScene";
import { sceneCamera } from "@components/threejs/sceneCamera";
import { resizerListener, sceneRenderer } from "@components/threejs/sceneRenderer";
import { sceneControls } from "@components/threejs/sceneControls";
import { sceneAmbient } from "@components/threejs/sceneAmbient";
import { sceneLight } from "@components/threejs/sceneLight";
import { floorPlanFbx } from "@components/threejs/Objects/floorPlanFbx";
import { LeafyGreen } from "lucide-react";
import { sceneGrid } from "@components/threejs/Objects/sceneGrid";
import { sceneFloor } from "@components/threejs/Objects/sceneFloor";
import useLoadingStore from "@store/Loader/loader.store";
import { CustomLoader } from "@components/Loader/Index";
import useNavStore from "@store/Nav/nav.store";

export const EditorPage = () => {
    const { setIsLoading } = useLoadingStore((state) => state);
    const { setIsOpen } = useNavStore((state) => state);

    const mountRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        console.log("Clicked the HTML Billboard!");
    }

    // Three.js scene setup
    useEffect(() => {
        const scene = baseScene();
        const camera = sceneCamera();
        const renderer = sceneRenderer();
        const controls = sceneControls(camera, renderer);
        const ambient = sceneAmbient();
        const directionalLight = sceneLight();
        const grid = sceneGrid();
        const plane = sceneFloor();
        const currentMount = mountRef.current;

        const objectGroup = new THREE.Group();
        const worldGroup = new THREE.Group();

        const labelPosition = new THREE.Vector3(0, 2.5, -2.7);
        
        setIsOpen(true);
        let animationId: number;

        if (currentMount) {
            currentMount.appendChild(renderer.domElement);
        }

        objectGroup.add ( grid );
        objectGroup.add ( plane );
        floorPlanFbx().then((object) => {
            objectGroup.add ( object );

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        });

        worldGroup.add ( ambient );
        worldGroup.add ( directionalLight );

        scene.add(objectGroup);
        scene.add(worldGroup);

        // Main animation loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update()
            renderer.render(scene, camera);
            renderer.antialias = true;

            if (labelRef.current) {
                const vector = labelPosition.clone().project(camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
                labelRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            }
        };
        animate();

        // Resize helper
        window.addEventListener("resize", () => resizerListener(camera, renderer));

        // Clean up on unmount
        return () => {
           window.removeEventListener("resize", () => resizerListener(camera, renderer));

            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
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

            setIsLoading(true);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
			{/* Loader */}
			<CustomLoader />
            
            <div ref={mountRef} className="w-full h-full relative overflow-hidden">
                {/* HTML Billboard */}
                <button 
                    ref={labelRef} 
                    className="absolute pointer-events-auto cursor-pointer" 
                    style={{ top: 0, left: 0 }}
                    onClick={handleClick}
                >
                    <div className="bg-light100 p-2 rounded-lg shadow-md flex items-center space-x-2">
                        <LeafyGreen className="w-6 h-6 text-green-600" />
                        <span>Room 1</span>
                    </div>
                </button>
            </div>
        </>
    );
};
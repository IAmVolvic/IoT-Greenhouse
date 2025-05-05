import { useEffect, useRef, useState } from "react";
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
<<<<<<< Updated upstream
import useEditorStore from "@store/Editor/editor.store";
import { greenHouseTable } from "../data/GreenhouseData";

=======
import { EditSheet } from "./index-components/EditSheet";
>>>>>>> Stashed changes

export const EditorPage = () => {
    const { setIsLoading } = useLoadingStore((state) => state);
    const { setIsOpen } = useNavStore((state) => state);
    const { selectedGH } = useEditorStore();

    const mountRef = useRef<HTMLDivElement>(null);
    const labelRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [sceneObjects, setSceneObjects] = useState<{ 
        camera?: THREE.PerspectiveCamera, 
        controls?: any,
        objectGroups?: Record<string, THREE.Group>
    }>({});

    const handleClick = (greenhouseId: string) => {
        console.log("Clicked on greenhouse:", greenhouseId);
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

        const objectGroups: Record<string, THREE.Group> = {};
        const worldGroup = new THREE.Group();
        
        // Store camera, controls and objects for later use when selected GH changes
        setSceneObjects({ camera, controls, objectGroups });

        setIsOpen(true);
        let animationId: number;

        if (currentMount) {
            currentMount.appendChild(renderer.domElement);
        }

        // Create the common ground elements
        worldGroup.add(grid);
        worldGroup.add(plane);
        worldGroup.add(ambient);
        worldGroup.add(directionalLight);

        // Initialize each greenhouse from the table
        greenHouseTable.forEach((greenhouse) => {
            const greenhouseGroup = new THREE.Group();
            greenhouseGroup.position.copy(greenhouse.position);
            objectGroups[greenhouse.id] = greenhouseGroup;

            // Load the floorplan model for this greenhouse
            floorPlanFbx().then((object) => {
                greenhouseGroup.add(object);
            });

            // Add the greenhouse to the scene
            scene.add(greenhouseGroup);
        });

        scene.add(worldGroup);

        // Main animation loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            controls.update();
            renderer.render(scene, camera);
            renderer.antialias = true;

            // Update all billboard positions
            greenHouseTable.forEach((greenhouse) => {
                const labelElement = labelRefs.current.get(greenhouse.id);
                if (labelElement) {
                    const vector = greenhouse.labelPosition.clone().project(camera);
                    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
                    labelElement.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                }
            });
        };
        animate();

        // Resize helper
        window.addEventListener("resize", () => resizerListener(camera, renderer));

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        // Clean up on unmount
        return () => {
            window.removeEventListener("resize", () => resizerListener(camera, renderer));

            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }

            // Cancel animation loop
            cancelAnimationFrame(animationId);

            // Remove objects from scene
            Object.values(objectGroups).forEach(group => {
                scene.remove(group);
            });
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

    // Move camera when selected greenhouse changes
    useEffect(() => {
        if (selectedGH && sceneObjects.camera && sceneObjects.controls) {
            console.log("Selected GH changed:", selectedGH);
            
            const selectedGreenhouse = greenHouseTable.find(gh => gh.id === selectedGH);
            if (selectedGreenhouse) {
                console.log("Moving to selected GH:", selectedGreenhouse.name);

                // Get the current camera position for smooth transition
                const currentPosition = sceneObjects.camera.position.clone();
                const currentTarget = sceneObjects.controls.target.clone();
                
                // Define a target position at the center of the greenhouse (for both camera and controls)
                const greenhouseCenter = new THREE.Vector3(
                    selectedGreenhouse.position.x,
                    selectedGreenhouse.position.y + 2,
                    selectedGreenhouse.position.z
                );
                
                // Calculate camera position - positioned to look at the greenhouse
                const targetPosition = selectedGreenhouse.position.clone().add(new THREE.Vector3(0, 4, 8));
                
                // Animate the camera movement
                const duration = 1200; // ms - longer duration for smoother feel
                const startTime = performance.now();
                
                function animateCamera(time: number) {
                    const elapsed = time - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Use cubic easing for smoother motion
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    
                    // Move camera to new position
                    sceneObjects.camera.position.lerpVectors(
                        currentPosition,
                        targetPosition,
                        easeProgress
                    );
                    
                    // Smoothly move the controls target too
                    sceneObjects.controls.target.lerpVectors(
                        currentTarget,
                        greenhouseCenter,
                        easeProgress
                    );
                    
                    // Update controls at each step of the animation
                    sceneObjects.controls.update();
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateCamera);
                    }
                }
                
                requestAnimationFrame(animateCamera);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGH]);

    return (
        <>
            {/* Loader */}
            <CustomLoader />
            
            <div ref={mountRef} className="w-full h-full relative overflow-hidden">
<<<<<<< Updated upstream
                {/* HTML Billboards */}
                {greenHouseTable.map((greenhouse) => (
                    <button 
                        key={greenhouse.id}
                        ref={(element) => {
                            if (element) {
                                labelRefs.current.set(greenhouse.id, element);
                            }
                        }}
                        className={`absolute pointer-events-auto transition-opacity duration-300 ${selectedGH === greenhouse.id ? 'opacity-100 cursor-pointer' : 'opacity-0 cursor-default'}`}
                        style={{ top: 0, left: 0 }}
                        onClick={() => handleClick(greenhouse.id)}
                    >
                        <div className={`bg-light100 p-2 rounded-lg shadow-md flex items-center space-x-2`}>
                            <LeafyGreen className="w-6 h-6 text-green-600" />
                            <span> {greenhouse.name} </span>
                        </div>
                    </button>
                ))}
=======
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

                <EditSheet />
>>>>>>> Stashed changes
            </div>
        </>
    );
};
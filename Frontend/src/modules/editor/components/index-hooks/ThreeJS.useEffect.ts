import { useEffect, useState } from "react";
// Three.js imports
import * as THREE from "three";
import { baseScene } from "@components/threejs/baseScene";
import { sceneCamera } from "@components/threejs/sceneCamera";
import { resizerListener, sceneRenderer } from "@components/threejs/sceneRenderer";
import { sceneControls } from "@components/threejs/sceneControls";
import { sceneAmbient } from "@components/threejs/sceneAmbient";
import { sceneLight } from "@components/threejs/sceneLight";
import { FloorPlan } from "@components/threejs/Objects/floorPlanFbx";
import { sceneGrid } from "@components/threejs/Objects/sceneGrid";
import { sceneFloor } from "@components/threejs/Objects/sceneFloor";
// Store imports
import useNavStore from "@store/Nav/nav.store";
import useEditorStore from "@store/Editor/editor.store";
// Data imports
import { greenHouseTable } from "@modules/editor/data/GreenhouseData";



interface ThreeJSUseEffectProps {
    mountRef: React.RefObject<HTMLDivElement>;
    labelRefs: React.RefObject<Map<string, HTMLButtonElement>>;
}

export const ThreeJSUseEffect = (props: ThreeJSUseEffectProps) => {
        const { selectedGH } = useEditorStore();
        const { setIsOpen } = useNavStore((state) => state);

        const [sceneObjects, setSceneObjects] = useState<{ 
            camera?: THREE.PerspectiveCamera, 
            controls?: THREE.OrbitControls,
            objectGroups?: Record<string, THREE.Group>
        }>({});

        
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
            const currentMount = props.mountRef.current;
    
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
                const floorPlan = new FloorPlan();
            
                floorPlan.load().then((fp) => {
                    greenhouseGroup.add(fp.object);
                    objectGroups[greenhouse.id] = fp;
                    // Apply visual state based on current selection
    
                    const isSelected = greenhouse.id === "gh1";
                    fp.updateGreenhouseVisual(isSelected);
                });
            
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
                    const labelElement = props.labelRefs.current!.get(greenhouse.id);
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
            };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
        // Move camera when selected greenhouse changes
        useEffect(() => {
            if (selectedGH && sceneObjects.camera && sceneObjects.controls && sceneObjects.objectGroups) {   
                // Update visual state for all greenhouses
                greenHouseTable.forEach((greenhouse) => {
                    const floorPlanInstance = sceneObjects.objectGroups?.[greenhouse.id] as FloorPlan;
                    if (floorPlanInstance) {
                        floorPlanInstance.updateGreenhouseVisual(greenhouse.id === selectedGH);
                    }
                });
                
                const selectedGreenhouse = greenHouseTable.find(gh => gh.id === selectedGH);
                if (selectedGreenhouse) {
                    const currentPosition = sceneObjects.camera.position.clone();
                    const currentTarget = sceneObjects.controls.target.clone();
                    
                    const greenhouseCenter = new THREE.Vector3(
                        selectedGreenhouse.position.x,
                        selectedGreenhouse.position.y + 2,
                        selectedGreenhouse.position.z
                    );
                    
                    const targetPosition = selectedGreenhouse.position.clone().add(new THREE.Vector3(0, 4, 8));
                    const duration = 1200;
                    const startTime = performance.now();
                    
                    function animateCamera(time: number) {
                        const elapsed = time - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
                        sceneObjects.camera.position.lerpVectors(currentPosition, targetPosition, easeProgress);
                        sceneObjects.controls.target.lerpVectors(currentTarget, greenhouseCenter, easeProgress);
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
}
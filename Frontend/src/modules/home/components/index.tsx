import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three-stdlib";
import { baseScene } from "@components/threejs/baseScene";
import { sceneCamera } from "@components/threejs/sceneCamera";
import { sceneRenderer } from "@components/threejs/sceneRenderer";
import { sceneControls } from "@components/threejs/sceneControls";
import { sceneAmbient } from "@components/threejs/sceneAmbient";
import { sceneLight } from "@components/threejs/sceneLight";
import { LeafyGreen } from "lucide-react"; // Import your Lucide icon

export const Home = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        console.log("Clicked the HTML Billboard!");
    }

    useEffect(() => {
        const scene = baseScene();
        const camera = sceneCamera();
        const renderer = sceneRenderer();
        const controls = sceneControls(camera, renderer);
        const ambient = sceneAmbient();
        const directionalLight = sceneLight();
        const labelPosition = new THREE.Vector3(0, 2.5, -3);


        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        scene.add(ambient);
        scene.add(directionalLight);

        const loader = new FBXLoader();
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

            scene.add(object);
        });


        const grid = new THREE.GridHelper(100, 50, "#5d678c", "#383f59");
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        grid.position.y = -0.015;
        scene.add(grid);

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.ShadowMaterial({
                color: "0xd81b60",
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
            })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.01;
        plane.scale.setScalar(1000);
        plane.receiveShadow = true;
        scene.add(plane);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);

            // Project label position to 2D screen
            if (labelRef.current) {
                const vector = labelPosition.clone().project(camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = ( -vector.y * 0.5 + 0.5) * window.innerHeight;
                labelRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            }
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
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
                <div className="bg-white p-2 rounded-lg shadow-md flex items-center space-x-2">
                    <LeafyGreen className="w-6 h-6 text-green-600" />
                    <span>Room 1</span>
                </div>
            </div>
        </div>
    );
};
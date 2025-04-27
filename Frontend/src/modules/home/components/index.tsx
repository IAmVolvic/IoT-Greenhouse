import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from "three-stdlib";

export const Home = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [raycaster] = useState(new THREE.Raycaster()); // Raycaster to detect clicks
    const [mouse] = useState(new THREE.Vector2()); // Mouse position to feed into the raycaster

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#171a26');
        scene.fog = new THREE.Fog( '#171a26', 15, 35 );

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 7);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true; // Enable shadow maps in renderer
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: soft shadows
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Disable panning, allow zoom and rotation
        controls.screenSpacePanning = false;  // Disable screen-space panning (this also affects drag)
        controls.enablePan = false;           // Disable panning completely
        controls.enableZoom = true;           // Enable zoom
        controls.enableRotate = true;         // Enable rotation
        
        controls.minDistance = 5;             // Minimum zoom distance
        controls.maxDistance = 10;            // Maximum zoom distance

        // Add a basic ambient light
        const ambient = new THREE.HemisphereLight( 0xffffff, 0xbfd4d2, 3 );
        scene.add( ambient );

        // Add directional light with shadows
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
        directionalLight.position.set( 3, 5, 3 ).multiplyScalar( 3 );
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(2048, 2048); // Increase shadow resolution
        directionalLight.shadow.camera.near = 0.5; // Near plane of the shadow camera
        directionalLight.shadow.camera.far = 50; // Far plane of the shadow camera
        directionalLight.shadow.bias = -0.005; // Adjust bias to avoid shadow acne
        scene.add( directionalLight );

        // Load the FBX model
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
                    mesh.castShadow = true;  // Enable shadow casting for the mesh
                    mesh.receiveShadow = true;  // Enable receiving shadows
                }
            });

            scene.add(object);
        });


        // Function to create a billboard label
        const createBillboard = (text: string, position: THREE.Vector3) => {
            // Create a basic canvas to hold the text
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = 512;
                canvas.height = 256;
                context.font = '40px Arial';
                context.fillStyle = 'white';
                context.fillText(text, 50, 100); // Position the text

                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;

                // Create sprite material with the texture
                const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

                // Create sprite (billboard)
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(2, 1, 1); // Adjust the size of the label
                sprite.position.copy(position); // Position the label

                return sprite;
            }
        };

        // Create a billboard at a specific location
        const billboard1 = createBillboard('Room 1', new THREE.Vector3(3, 0, -1));
        scene.add(billboard1);

        // Define the mouse click handler
        const onMouseClick = (event: MouseEvent) => {
            // Normalize mouse position to [-1, 1]
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the raycaster to use the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Check for intersections with the billboard
            const intersects = raycaster.intersectObjects([billboard1]);

            if (intersects.length > 0) {
                // If clicked on the first billboard, print to console
                console.log('Hello World');
            }
        };

        // Add event listener for mouse clicks only once (on initial mount)
        const handleClick = (event: MouseEvent) => onMouseClick(event);
        window.addEventListener('click', handleClick);


        const grid = new THREE.GridHelper( 100, 50, "#5d678c", "#383f59" );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        grid.position.y = -0.015;
        scene.add( grid );


        // Add a plane to receive shadows
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


        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // update controls every frame
            renderer.render(scene, camera);
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

    return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};
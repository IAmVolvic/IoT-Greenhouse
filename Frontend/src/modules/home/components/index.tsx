import { useEffect, useRef, useState } from "react";
import { baseScene } from "@components/threejs/baseScene";
import { sceneAmbient } from "@components/threejs/sceneAmbient";
import { sceneCamera } from "@components/threejs/sceneCamera";
import { sceneLight } from "@components/threejs/sceneLight";
import { resizerListener, sceneRenderer } from "@components/threejs/sceneRenderer";
import { sceneFloor } from "@components/threejs/Objects/sceneFloor";
import { sceneGrid } from "@components/threejs/Objects/sceneGrid";
import { SimpleContainer } from "@components/containers";
import Logo from "@assets/images/Logo.svg";
import { InputTypeEnum, TextInput } from "@components/inputs/textInput";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import useNavStore from "@store/Nav/nav.store";
import { useLogin } from "@hooks/authentication/useLogin";
import { Toaster } from "react-hot-toast";
import { useSignup } from "@hooks/authentication/useSignup";

export const Home = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const Login = useLogin({name: username, password: password});
    const Signup = useSignup({name: username, password: password});

    const { setIsOpen } = useNavStore((state) => state);
    const mountRef = useRef<HTMLDivElement>(null);

    // Three.js scene setup
    useEffect(() => {
        const scene = baseScene();
        const camera = sceneCamera();
        const renderer = sceneRenderer();
        const ambient = sceneAmbient();
        const directionalLight = sceneLight();
        const grid = sceneGrid();
        const plane = sceneFloor();
        const currentMount = mountRef.current;

        setIsOpen(false);
        let animationId: number;

        if (currentMount) {
            currentMount.appendChild(renderer.domElement);
        }

        camera.position.set(0, 10, 7);
        camera.lookAt(0, 3, 0);

        scene.add(grid);
        scene.add(plane);

        scene.add(ambient);
        scene.add(directionalLight);

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();


        // Resize helper
        window.addEventListener('resize', () => resizerListener(camera, renderer));

        // Clean up on unmount
        return () => {
           window.removeEventListener("resize", () => resizerListener(camera, renderer));

            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }

            // Cancel animation loop
            cancelAnimationFrame(animationId);

            scene.remove(grid);
            scene.remove(plane);
            scene.remove(ambient);
            scene.remove(directionalLight);
            
            renderer.dispose();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Toaster position="top-center"/>

            <div className="flex items-center justify-center w-full h-full relative">
                <div ref={mountRef} className="w-full h-full overflow-hidden" />

                <div className="absolute w-full h-full flex items-center justify-center z[5]">
                    <SimpleContainer className="flex flex-col items-center bg-dark100 max-w-md rounded-3xl pb-10 shadow-md mt-16 lg:mt-0">
                        <div className="flex justify-center items-center w-20 aspect-square">
                            <img src={Logo} alt="Logo" className="h-10 aspect-square svg-filter-green" />
                        </div>

                        <div className="flex flex-col items-center gap-8 w-full px-5 lg:px-12">
                            <div className="text-light200"> Sign in to Greenhouse </div>

                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="flex flex-row justify-center items-center bg-dark300 p-2 rounded-full mb-8">
                                    <TabsTrigger className="TabTrigger" value="login">Login</TabsTrigger>
                                    <TabsTrigger className="TabTrigger" value="Signup">Signup</TabsTrigger>
                                </TabsList>

                                <div className="flex flex-col gap-8">
                                    <TextInput inputType={InputTypeEnum.text} inputTitle="Username" setInput={setUsername} input={username} parentClassName="w-full text-light100" />
                                    <TextInput inputType={InputTypeEnum.password} inputTitle="Password" setInput={setPassword} input={password} parentClassName="w-full text-light100" />
                                </div>

                                <TabsContent value="login" className="mt-8">
                                    <button className="w-full bg-primary p-3 rounded-xl" onClick={Login}>Login</button>
                                </TabsContent>

                                <TabsContent value="Signup" className="mt-8">
                                    <button className="w-full bg-primary p-3 rounded-xl" onClick={Signup}>Signup</button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </SimpleContainer>
                </div>
            </div>
        </>
    );
};
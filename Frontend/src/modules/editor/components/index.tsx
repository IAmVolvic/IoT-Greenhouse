import { createElement, useEffect, useRef, useState } from "react";
import { ThreeJSUseEffect } from "./index-hooks/ThreeJS.useEffect";

import { AlarmSmoke, ChevronLeft, LeafyGreen, Sun, Thermometer } from "lucide-react";
import { CustomLoader } from "@components/Loader/Index";
/* import { EditSheet } from "./index-components/EditSheet"; */
import useEditorStore from "@store/Editor/editor.store";
import useLoadingStore from "@store/Loader/loader.store";
import { greenHouseTable } from "../data/GreenhouseData";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart } from "./index-components/ChartLine";
import { EditSheet } from "./index-components/EditSheet";
import { FloatingLabel } from "@components/threejs/Objects/floatingLabel";
import { useWsClient } from "ws-request-hook";
import { Api } from "@Api";
import useWebsocketClientStore from "@store/Websocket/clientid.store";

export const EditorPage = () => {
    const { setIsLoading } = useLoadingStore((state) => state);
    const { selectedGH } = useEditorStore();
    const [menuOpen, setMenuOpen] = useState(true);
    const mountRef = useRef<HTMLDivElement>(null);
    const labelRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    // Initialize Three.js scene and objects
    const [sceneObjects] = ThreeJSUseEffect({mountRef, labelRefs});

    const {readyState, onMessage} = useWsClient();
    const { clientId } = useWebsocketClientStore();


    // Set loading state
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {
            // Cleanup function if needed
            setIsLoading(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const api = new Api();
        api.subscription.subscribeYourDevicesCreate(clientId!, { withCredentials: true }).then((res) => {});
      }, []);


    useEffect(() => {
        if (readyState != 1) return;

        onMessage<any>("ServerBroadcastsLogToDashboard", (Data) => {
            console.log("Lobby message received:", Data);
        })
    }, [readyState]);

    return (
        <>
            {/* Loader */}
            <CustomLoader />

            <div ref={mountRef} className="w-full h-full relative overflow-hidden z-0">
                {/* HTML Billboards */}
                {greenHouseTable.map((greenhouse) => (
                    <div key={greenhouse.id} className={`pointer-events-auto transition-opacity duration-300 ${selectedGH === greenhouse.id ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Name tag */}
                        <FloatingLabel camera={sceneObjects.camera} position={greenhouse.labelPosition}>
                            <div className={`bg-light100 p-2 rounded-lg shadow-md flex items-center space-x-2`}>
                                <LeafyGreen className="w-6 h-6 text-green-600" />
                                <span> {greenhouse.name} </span>
                            </div>
                        </FloatingLabel>

                        {/* Icon with data */}

                        {
                            greenhouse.labelIocnPositions.map((Icons, i) => (
                                <FloatingLabel camera={sceneObjects.camera} position={Icons.position} key={`icon-${greenhouse.id}-${i}`}>
                                    <div className="bg-dark300 rounded-xl shadow-md p-2">
                                        <div className="flex flex-row items-center gap-2">
                                            {createElement(Icons.icon, { className: "w-6 h-6 text-light200" })}
                                            <div className="text-sm text-light200">200</div>
                                        </div>
                                    </div>
                                </FloatingLabel>
                            ))
                        }
                    </div>
                ))}
            </div>

            {/* Panel / Main Content */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">

                {/* SIDE PANEL */}
                <div className="absolute top-0 left-0 h-full flex items-center pointer-events-none z-20 p-5">
                    {/* Cool cutout thing I will try */}
                    <motion.div
                        className="w-128 h-full relative"
                        layout
                        transition={{ 
                            duration: 0.5, 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30 
                        }}
                    >
                        <motion.button 
                            className="absolute top-0 left-0 w-11 aspect-square rounded-full bg-dark100 flex items-center justify-center pointer-events-auto z-10"
                            onClick={() => {setMenuOpen(!menuOpen)}}
                            animate={{ rotate: menuOpen ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronLeft size={20} strokeWidth={1.5} className="text-light200" />
                        </motion.button>

                        <AnimatePresence mode="wait">
                            {menuOpen && (
                                <motion.div 
                                    className="bg-dark100 cut-top-left w-92 h-92 rounded-r-3xl rounded-bl-3xl overflow-hidden drop-shadow-md"
                                    initial={{ opacity: 0, x: -480 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -480 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 40
                                    }}
                                >
                                    <div className="cornerCut-top-left absolute top-0 left-0 w-20 aspect-square bg-dark100 -z-10" />
                                    
                                    <motion.div className="w-full flex items-center ml-14 px-5 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                        <div className="flex flex-col">
                                            <div className="text-xl text-light100">{greenHouseTable.find((greenhouse) => selectedGH === greenhouse.id)?.name}</div>
                                            <div className="text-sm text-light200">Data charts</div>
                                        </div>
                                    </motion.div>

                                    <motion.div className="flex flex-col gap-10 h-full w-full p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                        {/* <EditSheet /> */}

                                        {/* Placeholder for the chart, needs work / cleanup */}
                                        <div className="flex flex-col gap-3 pointer-events-auto">
                                            {/* Icon - Title - Button */}
                                            <div className="flex flex-row items-center justify-between">
                                                <div className="flex flex-row items-center gap-5">
                                                    <div className="bg-dark300 w-12 aspect-square rounded-xl flex items-center justify-center">
                                                        <AlarmSmoke size={20} strokeWidth={1.5} className="text-light200" />
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-md text-light100">Gas Sensor</div>
                                                        <div className="text-sm text-light200">Current rate: 1000ms</div>
                                                    </div>
                                                </div>

                                                <EditSheet />
                                            </div>
                                            
                                            <LineChart />
                                        </div>

                                        <div className="flex flex-col gap-3 pointer-events-auto">
                                            {/* Icon - Title - Button */}
                                            <div className="flex flex-row items-center justify-between">
                                                <div className="flex flex-row items-center gap-5">
                                                    <div className="bg-dark300 w-12 aspect-square rounded-xl flex items-center justify-center">
                                                        <Thermometer size={20} strokeWidth={1.5} className="text-light200" />
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-md text-light100">Temperature Sensor</div>
                                                        <div className="text-sm text-light200">Current rate: 1000ms</div>
                                                    </div>
                                                </div>

                                                <EditSheet />
                                            </div>
                                            
                                            <LineChart />
                                        </div>

                                        <div className="flex flex-col gap-3 pointer-events-auto">
                                            {/* Icon - Title - Button */}
                                            <div className="flex flex-row items-center justify-between">
                                                <div className="flex flex-row items-center gap-5">
                                                    <div className="bg-dark300 w-12 aspect-square rounded-xl flex items-center justify-center">
                                                        <Sun size={20} strokeWidth={1.5} className="text-light200" />
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-md text-light100">Light Sensor</div>
                                                        <div className="text-sm text-light200">Current rate: 1000ms</div>
                                                    </div>
                                                </div>

                                                <EditSheet />
                                            </div>
                                            
                                            <LineChart />
                                        </div>

                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>
        </>
    );
};
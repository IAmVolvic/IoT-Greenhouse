import { createElement, useEffect, useRef, useState } from "react";
import { ThreeJSUseEffect } from "./index-hooks/ThreeJS.useEffect";
import { ChevronLeft, LeafyGreen } from "lucide-react";
import { CustomLoader } from "@components/Loader/Index";
import useEditorStore from "@store/Editor/editor.store";
import useLoadingStore from "@store/Loader/loader.store";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingLabel } from "@components/threejs/Objects/floatingLabel";
import useWebsocketClientStore from "@store/Websocket/clientid.store";
import { useWsClient, BaseDto } from "ws-request-hook";
import { Api } from "@Api";
import { SensorChart } from "./index-components/SensorChart";
import { GreenHouseData, SensorInfo, useGetMyDevices } from "@hooks/devices/MyDevices";
import { useGreenhouseStore } from "@store/Editor/devices.store";


interface WebsocketMessage extends BaseDto {
    log: Log;
}

interface Log {
    id: string;
    deviceId: string;
    unit: string;
    value: number;
    type: string;
    date: string;
}

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
    
    // User devices
    const { data, loading } = useGetMyDevices();
    const [selectedData, setSelectedData] = useState<GreenHouseData | null>();


    // Set loading state
    useEffect(() => {
        if (!loading) {
            setIsLoading(true);
        }else {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

        return () => {
            // Cleanup function if needed
            setIsLoading(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);


    useEffect(() => {
        const api = new Api();
        api.subscription.subscribeYourDevicesCreate(clientId!, { withCredentials: true });
    });


    useEffect(() => {
        if (loading) return;
        if (readyState !== 1) return;

        onMessage<WebsocketMessage>("ServerBroadcastsLogToDashboard", (LogData) => {
            const log = LogData?.log;
            if (!log) return;

            console.log("LogData", log);

            useGreenhouseStore.getState().updateSensorValue(
                log.deviceId,
                log.type,
                log.value
            );
        });
    }, [loading, readyState, onMessage]);


    useEffect(() => {
        if (loading) return;
        const selectedData = data.find(greenhouse => greenhouse.id === selectedGH);
        if (!selectedData) return;
        setSelectedData(selectedData || null);

    }, [loading, selectedGH, data]);

    return (
        <>
            {/* Loader */}
            <CustomLoader />

            <div ref={mountRef} className="w-full h-full relative overflow-hidden z-0 select-none">
                {/* HTML Billboards */}
                {(!loading) && data.map((greenhouse) => (
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
                            greenhouse.SensorInfo.map((Sensor, i) => (
                                <FloatingLabel camera={sceneObjects.camera} position={Sensor.position} key={`icon-${greenhouse.id}-${i}`}>
                                    <div className="bg-dark300 rounded-xl shadow-md p-2">
                                        <div className="flex flex-row items-center gap-2">
                                            {createElement(Sensor.icon, { className: "w-6 h-6 text-light200" })}
                                            <div className="text-sm text-light200">{Sensor.value}</div>
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
                                            <div className="text-xl text-light100">{data.find((greenhouse) => selectedGH === greenhouse.id)?.name}</div>
                                            <div className="text-sm text-light200">Data charts</div>
                                        </div>
                                    </motion.div>

                                    <motion.div className="flex flex-col gap-10 h-full w-full p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                        {
                                            (!loading && selectedData != null) && selectedData.SensorInfo.map((sensorInfo: SensorInfo) => (
                                                <SensorChart
                                                    key={`${selectedGH}-${sensorInfo.name}`}
                                                    sensorName={`${sensorInfo.name} Sensor`}
                                                    tick={sensorInfo._v}
                                                    data={sensorInfo.value || 0}
                                                    icon={sensorInfo.icon}
                                                    numberToShow={20}
                                                />
                                            ))
                                        }
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
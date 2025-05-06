import { useEffect, useRef, useState } from "react";
import { ThreeJSUseEffect } from "./index-hooks/ThreeJS.useEffect";

import { ChevronLeft, LeafyGreen } from "lucide-react";
import { CustomLoader } from "@components/Loader/Index";
import { EditSheet } from "./index-components/EditSheet";
import useEditorStore from "@store/Editor/editor.store";
import useLoadingStore from "@store/Loader/loader.store";
import { greenHouseTable } from "../data/GreenhouseData";
import { motion, AnimatePresence } from "framer-motion";


export const EditorPage = () => {
    const { setIsLoading } = useLoadingStore((state) => state);
    const { selectedGH } = useEditorStore();

    const [menuOpen, setMenuOpen] = useState(true);

    const mountRef = useRef<HTMLDivElement>(null);
    const labelRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const handleClick = (greenhouseId: string) => {
        console.log("Clicked on greenhouse:", greenhouseId);
    }

    // Initialize Three.js scene and objects
    ThreeJSUseEffect({mountRef, labelRefs});

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

    return (
        <>
            {/* Loader */}
            <CustomLoader />

            <div ref={mountRef} className="w-full h-full relative overflow-hidden z-0">
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
            </div>

            {/* Panel / Main Content */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">

                {/* SIDE PANEL */}
                <div className="absolute top-0 left-0 h-full flex items-center pointer-events-none z-20 p-5">
                    {/* Cool cutout thing I will try */}
                    <motion.div
                        className="w-80 h-full relative"
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
                                    className="bg-dark100 cut-top-left w-full h-full rounded-r-3xl rounded-bl-3xl overflow-hidden drop-shadow-md"
                                    initial={{ opacity: 0, x: -280 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -280 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 40
                                    }}
                                >
                                    <div className="cornerCut-top-left absolute top-0 left-0 w-20 aspect-square bg-dark100 -z-10" />
                                    
                                    <motion.div 
                                        className="w-full flex items-center ml-14 px-5 py-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex flex-col">
                                            <div className="text-xl text-light100">Cool Title</div>
                                            <div className="text-sm text-light200">Something cool goes here</div>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="h-full w-full p-5"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <EditSheet />
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
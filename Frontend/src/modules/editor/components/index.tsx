import { useEffect, useRef } from "react";
import { ThreeJSUseEffect } from "./index-hooks/ThreeJS.useEffect";

import { LeafyGreen } from "lucide-react";
import { CustomLoader } from "@components/Loader/Index";
import { EditSheet } from "./index-components/EditSheet";
import useEditorStore from "@store/Editor/editor.store";
import useLoadingStore from "@store/Loader/loader.store";
import { greenHouseTable } from "../data/GreenhouseData";


export const EditorPage = () => {
    const { setIsLoading } = useLoadingStore((state) => state);
    const { selectedGH } = useEditorStore();

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
                <EditSheet  />
            </div>
        </>
    );
};
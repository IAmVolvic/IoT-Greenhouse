import useNavStore from "@store/Nav/nav.store";
import {House, PencilRuler } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogout } from "@hooks/authentication/useLogout";
import { useAuth } from "@hooks/authentication/useAuthentication";
import { EditorNavButtons } from "@modules/editor/components/index-components/nav-buttons";
import useEditorStore from "@store/Editor/editor.store";
import { greenHouseTable } from "@modules/editor/data/GreenhouseData";

// Todo
// Nav for mobile

export const Navbar = () => {
    const { selectedGH } = useEditorStore();
    const greenHouseMap = Object.fromEntries(greenHouseTable.map(gh => [gh.id, gh]));

    const { isOpen } = useNavStore((state) => state);
    const { user } = useAuth();
    const Logout = useLogout();

	return (
        <div className="absolute z-10 flex items-center justify-center w-full h-14 px-10 mt-5">
            <motion.div 
                className="flex flex-row items-center justify-center h-full rounded-full bg-dark100 p-2 shadow-md"
                layout
                transition={{ 
                    duration: 0.5, 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30 
                }}
            >
                {/* LEFT */} 
                <div className={`flex flex-row items-center h-full gap-2 ${isOpen ? 'w-52' : ''}`}>
                    {!isOpen && (
                        <>
                            <NavLink className={(values) => `h-full ${values.isActive  ? 'ActiveNav' : ''}` } to="/">
                                <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full">
                                    <House size={20} strokeWidth={1.5} />
                                </div>
                            </NavLink>
                            
                            <div className="w-0.5 h-7 bg-dark300" />
                        </>
                    )}

                    {isOpen && (
                        <div className="flex flex-row items-center justify-start h-full min-w-32 max-w-48 bg-dark300 rounded-full gap-2 pr-3">
                            <div className="flex justify-center items-center bg-primary rounded-full aspect-square h-full">
                                <PencilRuler size={20} strokeWidth={1.5} />
                            </div>

                            <div className="text-light200 text-sm text-nowrap text-ellipsis overflow-hidden"> {selectedGH ? greenHouseMap[selectedGH]?.name : ''} </div>
                        </div>
                    )}
                    
                    {!isOpen && (
                        <NavLink className={(values) => `h-full ${values.isActive  ? 'ActiveNav' : ''}` } to="/editor">
                            <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full">
                                <PencilRuler size={20} strokeWidth={1.5} />
                            </div>
                        </NavLink>
                    )}
                </div>

                {/* CENTER */}
                {isOpen && (
                    <EditorNavButtons />
                )}
                
                {/* RIGHT */}
                {isOpen && (
                    <div className={`flex flex-row items-center justify-end h-full w-52`}>
                        <button className={`flex flex-row items-center gap-3 h-full px-2` } onClick={Logout}>
                            <div className="border-1.5 border-primary w-full h-full rounded-full flex justify-center items-center">
                                <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.name}`} alt="UICON" className="h-full aspect-square" />
                            </div>

                            <div className="flex flex-col items-start justify-center">
                                <div className="text-light200 text-sm capitalize"> {user?.name} </div>
                                <div className="text-light200 text-xs capitalize"> {user?.role?.toString().toLowerCase()} </div>
                            </div>
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
	)
}
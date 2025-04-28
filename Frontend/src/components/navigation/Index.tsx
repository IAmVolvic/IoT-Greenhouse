import { SelectInput } from "@components/inputs/select";
import useNavStore from "@store/Nav/nav.store";
import { CirclePlus, House, PencilRuler, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

// Todo
// Nav for mobile

export const Navbar = () => {
    const { isOpen } = useNavStore((state) => state);
    
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
                <div className={`flex flex-row items-center h-full gap-2 ${isOpen ? 'w-52' : 'w-24'}`}>
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
                        <NavLink className="flex flex-row items-center justify-start h-full w-32 bg-dark300 rounded-full gap-2" to="/editor">
                            <div className="flex justify-center items-center bg-primary rounded-full aspect-square h-full">
                                <PencilRuler size={20} strokeWidth={1.5} />
                            </div>

                            <div className="text-light200 text-sm"> Room 1 </div>
                        </NavLink>
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
                    <div className="flex flex-row items-center justify-center flex-1 h-full">
                        <div className="flex flex-row items-center justify-center h-full bg-dark300 rounded-full gap-2">
                            <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full hover:bg-light100 hover:text-dark100">
                                <CirclePlus size={20} strokeWidth={1.5} />
                            </div>

                            <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full">
                                <SelectInput
                                    inputTitle="Select a project"
                                    handleChange={() => {}}
                                    selectArray={["Room 1", "Room 2"]}
                                    defaultValue="default"
                                    defaultValueText="Select a project"
                                    parentClassName="flex justify-center items-center h-full"
                                    titleClassName="hidden"
                                />
                            </div>

                            <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full hover:bg-light100 hover:text-dark100">
                                <Settings size={20} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                )}
                

                {/* RIGHT */}
                {isOpen && (
                    <div className={`flex flex-row items-center justify-end h-full w-52`}>
                        <NavLink className={(values) => `flex flex-row items-center gap-3 h-full px-2 ${values.isActive  ? 'ActiveNav' : ''}` } to="/">
                            <div className="border-1.5 border-primary w-full h-full rounded-full flex justify-center items-center">
                                <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=zolvic" alt="UICON" className="h-full aspect-square" />
                            </div>

                            <div className="flex flex-col items-start justify-center">
                                <div className="text-light200 text-sm"> Username </div>
                                <div className="text-light200 text-xs"> Admin </div>
                            </div>
                        </NavLink>
                    </div>
                )}
            </motion.div>
        </div>
	)
}
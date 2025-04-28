import { SelectInput } from "@components/inputs/select";
import { CirclePlus, House, PencilRuler, Settings } from "lucide-react";

// Todo
// Nav for mobile

export const Navbar = () => {
	return (
        <div className="absolute z-10 flex items-center justify-center w-full h-14 px-10 mt-5">
            <div className="flex flex-row items-center justify-center w-224 h-full rounded-full bg-dark100 p-2 shadow-md">
                {/* LEFT */} 
                <div className="flex flex-row items-center w-52 h-full gap-2">
                    <div className="flex justify-center items-center bg-dark200 text-light200 rounded-full aspect-square h-full">
                        <House size={20} strokeWidth={1.5} />
                    </div>

                    <div className="w-0.5 h-7 bg-dark200" />

                    <div className="flex flex-row items-center justify-start h-full w-32 bg-dark200 rounded-full gap-2">
                        <div className="flex justify-center items-center bg-primary rounded-full aspect-square h-full">
                            <PencilRuler size={20} strokeWidth={1.5} />
                        </div>

                        <div className="text-light200 text-sm"> Room 1 </div>
                    </div>
  
                </div>

                {/* CENTER */}
                <div className="flex flex-row items-center justify-center flex-1 h-full">
                    <div className="flex flex-row items-center justify-center h-full bg-dark200 rounded-full gap-2">
                        <div className="flex justify-center items-center bg-dark200 text-light200 rounded-full aspect-square h-full hover:bg-light100 hover:text-dark100">
                            <CirclePlus size={20} strokeWidth={1.5} />
                        </div>

                        <div className="flex justify-center items-center bg-dark200 text-light200 rounded-full aspect-square h-full">
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

                        <div className="flex justify-center items-center bg-dark200 text-light200 rounded-full aspect-square h-full hover:bg-light100 hover:text-dark100">
                            <Settings size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    
                </div>

                {/* RIGHT */}
                <div className="flex flex-row items-center justify-end w-52 h-full">
                    <div className="flex justify-center items-center bg-dark200 h-full w-20 rounded-full">
                        <div className="text-light200 text-sm">Login</div>
                    </div>
                    
                </div>
            </div>
        </div>
	)
}


{/* <div className="flex justify-center items-center bg-primary rounded-full aspect-square h-full">
                    <House size={20} strokeWidth={1.5} />
                </div> */}

{/*                 <div className="flex justify-center items-center bg-dark300 rounded-full aspect-square h-full">
                    <PencilRuler size={16} strokeWidth={1.5} className="text-light200" />
                </div> */}

                
                {/* <div className="flex justify-center items-center bg-dark300 h-full w-20 rounded-full">
                    <div className="text-light100 text-sm">Login</div>
                </div> */}
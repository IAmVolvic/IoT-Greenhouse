import { House, PencilRuler } from "lucide-react";


export const Navbar = () => {
	return (
        <div className="absolute z-10 flex items-center justify-center w-full h-14 px-10 mt-5">
            <div className="flex flex-row items-center justify-between w-224 h-full rounded-full bg-dark100 p-2">
                <div className="flex justify-center items-center bg-primary rounded-full aspect-square h-full">
                    <House size={20} strokeWidth={1.5} />
                </div>

{/*                 <div className="flex justify-center items-center bg-dark300 rounded-full aspect-square h-full">
                    <PencilRuler size={16} strokeWidth={1.5} className="text-light200" />
                </div> */}

                
                <div className="flex justify-center items-center bg-dark300 h-full w-20 rounded-full">
                    <div className="text-light100 text-sm">Login</div>
                </div>
            </div>
        </div>
	)
}
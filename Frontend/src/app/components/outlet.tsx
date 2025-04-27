import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { CustomLoader } from "@components/Loader/Index";
import { House } from "lucide-react";


const RootContent = () => {
	return (
		<>
			{/* Loader */}
			<CustomLoader />

			<Toaster position="top-center"/>

			{/* TopNav */}
			<div className="absolute z-10 flex items-center justify-center w-full h-14 px-10 mt-5">
				<div className="flex flex-row items-center justify-between w-224 h-full rounded-full bg-dark100 p-2">
					<div className="flex justify-center items-center bg-primary rounded-full aspect-square w-10">
						<House size={20} strokeWidth={1.5} />
					</div>

					<div className="flex justify-center items-center bg-dark300 h-full w-20 rounded-full">
						<div className="text-light100 text-sm">Login</div>
					</div>
				</div>
			</div>

			<Outlet />
		</>
	)
}


export const RootOutlet = () => {
	return <RootContent />
}
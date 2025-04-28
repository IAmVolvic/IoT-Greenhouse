import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { CustomLoader } from "@components/Loader/Index";
import { Navbar } from "@components/navigation/Index";


const RootContent = () => {
	return (
		<>
			{/* Loader */}
			<CustomLoader />

			<Toaster position="top-center"/>

			{/* TopNav */}
			<Navbar />

			<Outlet />
		</>
	)
}


export const RootOutlet = () => {
	return <RootContent />
}
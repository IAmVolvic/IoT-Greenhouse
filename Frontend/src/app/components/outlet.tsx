import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { Navbar } from "@components/navigation/Index";
import { Watermark } from "@components/watermark";


const RootContent = () => {
	return (
		<>
			<Toaster position="top-center"/>

			{/* TopNav */}
			<Navbar />

			<Watermark />

			<Outlet />
		</>
	)
}


export const RootOutlet = () => {
	return <RootContent />
}
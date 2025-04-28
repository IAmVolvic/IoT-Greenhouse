import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { Navbar } from "@components/navigation/Index";


const RootContent = () => {
	return (
		<>
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
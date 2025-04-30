import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { Navbar } from "@components/navigation/Index";
import { Watermark } from "@components/watermark";
import { ProtectedComponent } from "@components/authProtected/ProtectedComponent";

interface RouteOutletProps {
	isProtected: boolean;
	failedAuthPath?: string;
}

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


export const RootOutlet = (props: RouteOutletProps) => {
	return props.isProtected ? (
		<ProtectedComponent showWhileAuthenticated={true} redirect={props.failedAuthPath!}>
			<RootContent />
		</ProtectedComponent>
	) : (
		<RootContent />
	)
}
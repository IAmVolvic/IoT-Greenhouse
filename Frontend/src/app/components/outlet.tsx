import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { Navbar } from "@components/navigation/Index";
import { Watermark } from "@components/watermark";
import { ProtectedComponent } from "@components/authProtected/ProtectedComponent";

interface RouteOutletProps {
	isRootContent: boolean;
	failedAuthPath?: string;
	showWhileAuthenticated?: boolean;
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
	return !props.isRootContent ? (
		<ProtectedComponent showWhileAuthenticated={props.showWhileAuthenticated!} redirect={props.failedAuthPath!}>
			<RootContent />
		</ProtectedComponent>
	) : (
		<RootContent />
	)
}
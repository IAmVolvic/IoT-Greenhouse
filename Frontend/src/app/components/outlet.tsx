import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast";


const RootContent = () => {
    // const [theme] = useAtom(ThemeAtom);

	// useEffect(() => {
	// 	const theme = localStorage.getItem('theme') as string;
	// 	document.documentElement.setAttribute('data-theme', theme);
	// }, [theme]);

	return (
		<>
			<Toaster position="top-center"/>
			<Outlet />
		</>
	)
}


export const RootOutlet = () => {
	return <RootContent />
}
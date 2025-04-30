import { useEffect, useState } from "react";
import Logo from "@assets/images/Logo.svg";
import useLoadingStore from "@store/Loader/loader.store";

export const CustomLoader = () => {
    const { isLoading } = useLoadingStore((state) => state);
    const [hasLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                setLoaded(true);
            }, 700); // Fade-out duration
        }
    }, [isLoading]);

    return (
        <>
            {
                !hasLoaded && (
                    <div className={`loader absolute inset-0 flex items-center justify-center bg-dark100 z-50 ${!isLoading ? 'fade-out' : ''}`}>
                        <div className="flex items-center justify-center">
                            <img src={Logo} alt="Logo" className="w-20 h-20 svg-filter-green" />

                            <div className="absolute mt-2">
                                <div className="flex justify-center items-center w-full h-full">
                                    <div className="circle-loader border-2 border-dark200 border-l-success w-44 h-44" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};
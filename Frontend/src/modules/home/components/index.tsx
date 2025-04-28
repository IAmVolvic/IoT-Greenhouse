import useNavStore from "@store/Nav/nav.store";
import { useEffect } from "react";

export const Home = () => {
    const { setIsOpen } = useNavStore((state) => state);

    useEffect(() => {
        setIsOpen(false);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        World
        </>
    );
};
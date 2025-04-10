import { ReactNode } from "react";


type BaseContainer = {
    className?: string;
    children?: ReactNode;
}

interface LargeContainerProps extends BaseContainer {};
interface SmallContainerProps extends BaseContainer {};


export const LargeContainer = (props: LargeContainerProps) => {
	return (
		<div className={`container max-w-7xl mx-auto px-5 lg:px-0 ${props.className}`}>
            {props.children}
        </div>
	)
}


export const SmallContainer = (props: SmallContainerProps) => {
	return (
		<div className={`container max-w-4xl mx-auto px-5 lg:px-0 my-40 ${props.className}`}>
            {props.children}
        </div>
	)
}

export const SimpleContainer = (props: SmallContainerProps) => {
	return (
		<div className={`container max-w-7xl mx-auto px-5 lg:px-0 ${props.className}`}>
            {props.children}
        </div>
	)
}
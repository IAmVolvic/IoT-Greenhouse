import { Link } from "react-router-dom"


interface ButtonProps {
    title?: string
    linkTo?: string
    color: ButtonColor
}

export enum ButtonColor {
    primary = "primary",
    secondary = "secondary",
    error = "error",
    warning = "warning",
    success = "success",
    info = "info",
    neutral = "neutral"
}

const colorClassMap: { [key in ButtonColor]: { background: string, text: string, border: string } } = {
    [ButtonColor.primary]: {
        background: ' bg-primary',
        text: 'text-primary-content ',
        border: 'border-primary'
    },
    [ButtonColor.secondary]: {
        background: ' bg-secondary',
        text: 'text-secondary-content ',
        border: 'border-secondary'
    },
    [ButtonColor.error]: {
        background: ' bg-error',
        text: 'text-error-content ',
        border: 'border-error'
    },
    [ButtonColor.warning]: {
        background: ' bg-warning',
        text: 'text-warning-content ',
        border: 'border-warning'
    },
    [ButtonColor.success]: {
        background: ' bg-success',
        text: 'text-success-content ',
        border: 'border-success'
    },
    [ButtonColor.info]: {
        background: ' bg-info',
        text: 'text-info-content ',
        border: 'border-info'
    },
    [ButtonColor.neutral]: {
        background: ' bg-neutral',
        text: 'text-neutral-content ',
        border: 'border-neutral'
    }
};


export const LinkButton = (props: ButtonProps) => {
    const { background, text, border } = colorClassMap[props.color];
    
    return (
        <Link to={props.linkTo ?? "/"} className="min-w-25 min-h-25">
           <div className="flex justify-center items-center relative">
                <div className={`flex items-center justify-center w-full h-full ${background} rounded-2xl relative left-2 z-10`}>
                    <div className={`${text} font-bold px-20 py-5`}>{props.title}</div>
                </div>

                <div className={`absolute w-full h-full border-1.5 ${border} rounded-2xl top-2 -z-10`}></div>
           </div>
        </Link>
    )
}

interface TextInputProps {
    inputTitle: string;
    setInput: (input: string ) => void;
    input: string;
    inputType: InputTypeEnum;

    parentClassName?: string;
    titleClassName?: string;
}

export enum InputTypeEnum {
    text = "text",
    password = "password",
    email = "email",
    number = "number",
    date = "date",
    time = "time",
    datetime = "datetime",
    tel = "telephone",
    url = "url",
    search = "search",
    color = "color"
}

export const TextInput = (props: TextInputProps) => {
    return (
        <div className={props.parentClassName}>     
            <div className={props.titleClassName}>{props.inputTitle}</div>
            <input type={props.inputType} placeholder={props.input} value={props.input} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setInput(event.target.value) } className="w-full bg-base-300 p-3 rounded-xl" />
        </div>
    )
}
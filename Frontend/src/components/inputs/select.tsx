
interface TextInputProps {
    inputTitle: string;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectArray: string[];

    defaultValue?: string;
    defaultValueText?: string;

    parentClassName?: string;
    titleClassName?: string;
}

export const SelectInput = (props: TextInputProps) => {
    return (
        <div className={props.parentClassName}>     
            <div className={props.titleClassName}>{props.inputTitle}</div>

            <select onChange={props.handleChange} value={props.defaultValue} className="w-full bg-base-300 p-3 rounded-xl">
                {props.defaultValueText && (
                    <option value="default" disabled>{props.defaultValueText}</option>
                )}

                {props.selectArray.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}
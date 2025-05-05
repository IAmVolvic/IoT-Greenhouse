interface SelectOption {
    value: string;
    label: string;
}

interface TextInputProps {
    inputTitle: string;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectArray: SelectOption[] | string[];

    defaultValue?: string;
    defaultValueText?: string;

    parentClassName?: string;
    titleClassName?: string;
}

export const SelectInput = (props: TextInputProps) => {
    return (
        <div className={props.parentClassName}>     
            <div className={props.titleClassName}>{props.inputTitle}</div>

            <select onChange={props.handleChange} value={props.defaultValue} className="rounded-xl text-sm bg-transparent outline-none focus:ring-0 border-none bg-dark200 cursor-pointer w-32">
                {props.defaultValueText && (
                    <option value="default" disabled>{props.defaultValueText}</option>
                )}

                {props.selectArray.map((option, index) => {
                    // Check if the option is a string or an object
                    if (typeof option === 'string') {
                        return (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        );
                    } else {
                        return (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        );
                    }
                })}
            </select>
        </div>
    )
}
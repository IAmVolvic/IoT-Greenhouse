import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CgClose } from "react-icons/cg";

export type Option = {
    value: string;
    label: string;
    disabled?: boolean;
};

type CustomSelectProps = {
    selectClassName?: string;
    placeHolder?: string;
    options: Option[];
    onSelectionChange?: (selectedItems: Option[]) => void;
};

// Wrap the component with forwardRef to expose methods to the parent
export const CustomSelect = forwardRef<{ clearSelection: () => void; }, CustomSelectProps>((props, ref) => {
    const [selectedItems, setSelectedItems] = useState<Option[]>([]);
    const [options, setOptions] = useState<Option[]>(props.options);

    useEffect(() => {
        if (props.onSelectionChange) {
            props.onSelectionChange(selectedItems);
        }
    }, [selectedItems, props.onSelectionChange]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue) {
            const selectedOption = options.find(option => option.value === selectedValue);
            if (selectedOption) {
                setSelectedItems([...selectedItems, selectedOption]);
                setOptions(options.map(option =>
                    option.value === selectedValue ? { ...option, disabled: true } : option
                ));
            }
        }
    };

    const handleRemove = (value: string) => {
        setSelectedItems(selectedItems.filter(item => item.value !== value));
        setOptions(options.map(option =>
            option.value === value ? { ...option, disabled: false } : option
        ));
    };

    // Expose the clearSelection method to the parent
    useImperativeHandle(ref, () => ({
        clearSelection() {
            setSelectedItems([]);
            setOptions(props.options);
        }
    }));

    return (
        <div className="flex flex-col gap-4 w-full">
            <select onChange={handleSelectChange} value="default" className={props.selectClassName}>
                <option value="default" disabled>{props.placeHolder}</option>

                {options.map(option => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            <div className="flex flex-row flex-wrap gap-2 items-center">
                {selectedItems.map(item => (
                    <button 
                        key={item.value}
                        onClick={() => handleRemove(item.value)} 
                        className="flex flex-row justify-center items-center gap-2 bg-base-300 rounded-full px-5 py-1.5 text-sm"
                    >
                        <CgClose />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});
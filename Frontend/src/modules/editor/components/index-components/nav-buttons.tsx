import { useEffect, useState } from "react";
import { SelectInput } from "@components/inputs/select";
import { CirclePlus, Settings } from "lucide-react";
import useEditorStore from "@store/Editor/editor.store";

// Use the same structure as in the main component
interface GreenHouseData {
    id: string;
    name: string;
}

export const EditorNavButtons = () => {
    // Matching the greenhouse table structure from the main component
    const GreenTable: GreenHouseData[] = [
        { id: "gh1", name: "Greenhouse 1" },
        { id: "gh2", name: "Greenhouse 2" },
        { id: "gh3", name: "Greenhouse 3" },
        { id: "gh4", name: "Greenhouse 4" }
    ];

    const { selectedGH, setSelectedGH } = useEditorStore();

    // Create a dropdown-friendly array of greenhouse IDs for the select input
    const greenhouseSelectOptions = GreenTable.map(gh => gh.id);

    useEffect(() => {
        // Set the first greenhouse ID as the default selection
        setSelectedGH(GreenTable[0].id);

        return () => {
            setSelectedGH(null);
        }
    }, []);

	return (
        <div className="flex flex-row items-center justify-center flex-1 h-full">
            <div className="flex flex-row items-center justify-center h-full bg-dark300 rounded-full gap-2">
                <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full hover:bg-light100 hover:text-dark100">
                    <CirclePlus size={20} strokeWidth={1.5} />
                </div>

                <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full">
                    <SelectInput
                        inputTitle="Select a project"
                        handleChange={(e) => { setSelectedGH(e.target.value); }}
                        selectArray={greenhouseSelectOptions}
                        defaultValue={selectedGH || ""}
                        defaultValueText="Select a project"
                        parentClassName="flex justify-center items-center h-full"
                        titleClassName="hidden"
                    />
                </div>

                <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full hover:bg-light100 hover:text-dark100">
                    <Settings size={20} strokeWidth={1.5} />
                </div>
            </div>
        </div>
	)
}
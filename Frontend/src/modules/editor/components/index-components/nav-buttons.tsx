import { useEffect } from "react";
import { SelectInput } from "@components/inputs/select";
import { CirclePlus, Settings } from "lucide-react";
import useEditorStore from "@store/Editor/editor.store";
import { useGetMyDevices } from "@hooks/devices/MyDevices";
import { EditDevice } from "./Sheets/EditDeviceSheet";
import { NewDevice } from "./Sheets/NewDeviceSheet";


export const EditorNavButtons = () => {
    const { selectedGH, setSelectedGH } = useEditorStore();
    const { data, loading } = useGetMyDevices();

    /* Create a dropdown-friendly array of greenhouse objects with id as value and name for display */
    const greenhouseSelectOptions = data.map(gh => ({
        value: gh.id,
        label: gh.name
    }));

    useEffect(() => {
        // Set the first greenhouse ID as the default selection
        setSelectedGH((!loading && data.length > 0) ? data[0].id : null);

        return () => {
            setSelectedGH(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, setSelectedGH]);

	return (
        <div className="flex flex-row items-center justify-center flex-1 h-full">
            <div className="flex flex-row items-center justify-center h-full bg-dark300 rounded-full gap-2">
                <NewDevice />

                <div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-full">
                    <SelectInput
                        inputTitle="Select a project"
                        handleChange={(e) => { setSelectedGH(e.target.value); }}
                        selectArray={greenhouseSelectOptions}
                        defaultValue={selectedGH || ""}
                        defaultValueText="Select a project"
                        parentClassName="flex items-center justify-start h-full overflow-hidden text-nowrap text-ellipsis"
                        titleClassName="hidden"
                    />
                </div>

                <EditDevice />
            </div>
        </div>
	)
}
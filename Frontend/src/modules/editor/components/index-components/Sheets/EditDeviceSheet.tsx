import { Api } from "@Api";
import { InputTypeEnum, TextInput } from "@components/inputs/textInput";
import { Sheet, SheetClose, SheetTrigger } from "@components/shadcn-ui/ui/sheet";
import { SheetContent } from "@components/Sheets/components/sheetContent";
import { useGetMyDevices } from "@hooks/devices/MyDevices";
import { DialogTitle } from "@radix-ui/react-dialog";
import useEditorStore from "@store/Editor/editor.store";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

export const EditDevice = () => {
	const { selectedGH, setSelectedGH } = useEditorStore();
    const { data, loading, refresh } = useGetMyDevices();
    const greenHouseMap = Object.fromEntries(data.map(gh => [gh.id, gh]));
	const api = new Api();

	// Handle device editing
	const [deviceName, setDeviceName] = useState("");
	const [sensorRate, setSensorRate] = useState("");
	

	// Populate the input fields with the selected device's data
	useEffect(() => {
		if (loading) return;

		if (selectedGH && greenHouseMap[selectedGH]) {
			const selectedDevice = greenHouseMap[selectedGH];
			setDeviceName(selectedDevice.name);
			setSensorRate(selectedDevice.deviceRate.toString());
		}
	}, [loading, selectedGH]);

	// Handle device deletion
	const handleDeleteDevice = () => {
		const deviceIdToDelete = selectedGH;
		
		document.querySelector('.SheetClose')?.dispatchEvent(
			new MouseEvent('click', { bubbles: true })
		);
		
		if (deviceIdToDelete) {
			setSelectedGH(null);

			api.device.removeDeviceFromUserDelete(deviceIdToDelete, {withCredentials: true})
			.then(() => {
				refresh();
				return window.location.reload();
			})
			.then(() => {
				if (data.length > 0) {
					setSelectedGH(data[0].id);
				}
			})
			.catch(error => {
				console.error("Error deleting device:", error);
			});
		}
	}

	const handleSaveChanges = () => {
		if (!selectedGH) return;

		api.device.preferencesChangePreferencesPartialUpdate({deviceId: selectedGH, sensorInterval: Number(sensorRate)}, {withCredentials: true}).then(() => {
			api.device.changeDeviceNamePartialUpdate({deviceId: selectedGH, deviceName: deviceName}, {withCredentials: true}).then(() => {
				refresh();
			});
		});
	};

	return (
		<Sheet>
			<SheetTrigger>
				<div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-10 hover:bg-primary hover:text-dark100">
                    <Settings size={20} strokeWidth={1.5} />
                </div>
			</SheetTrigger>

			<SheetContent>
				<DialogTitle></DialogTitle>
				<div className="flex flex-col justify-between h-full w-full py-5">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col">
							<div className="text-xl text-light100">{selectedGH ? greenHouseMap[selectedGH]?.name : ""}</div>
							<div className="text-sm text-light200">Edit your device details here</div>
						</div>

						<div className="flex flex-col gap-10">
							<TextInput parentClassName="flex flex-col gap-2 w-full text-light200" titleClassName="text-light100 text-sm" inputType={InputTypeEnum.text} inputTitle="Device Name" setInput={setDeviceName} input={deviceName} />

							<TextInput parentClassName="flex flex-col gap-2 w-full text-light200" titleClassName="text-light100 text-sm" inputType={InputTypeEnum.number} inputTitle="Device Sensor Rate" setInput={setSensorRate} input={sensorRate.toString()} />

							<button className="flex items-center justify-center gap-2 text-sm text-light100 bg-danger rounded-full px-5 h-10" onClick={handleDeleteDevice}>
								<div className="text-sm">Delete Device</div>
							</button>
						</div>
					</div>


					<SheetClose className="flex items-center justify-center gap-2 text-sm text-dark100 bg-primary rounded-full px-5 h-10" onClick={handleSaveChanges}>
						<div className="text-sm">Save Changes</div>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
};
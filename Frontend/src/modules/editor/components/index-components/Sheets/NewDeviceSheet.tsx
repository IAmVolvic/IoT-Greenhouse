import { useState, useEffect } from "react";
import { Api, UnassignedDevice } from "@Api";
import { InputTypeEnum, TextInput } from "@components/inputs/textInput";
import { Sheet, SheetClose, SheetTrigger } from "@components/shadcn-ui/ui/sheet";
import { SheetContent } from "@components/Sheets/components/sheetContent";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CirclePlus } from "lucide-react";

import useEditorStore from "@store/Editor/editor.store";
import { useGetMyDevices } from "@hooks/devices/MyDevices";

export const NewDevice = () => {
	const { selectedGH } = useEditorStore();
	const { data, refresh } = useGetMyDevices();
	const api = new Api();

	const greenHouseMap = Object.fromEntries(data.map(gh => [gh.id, gh]));

	const [newDevice, setNewDevice] = useState<string>("default");
	const [newDeviceName, setNewDeviceName] = useState<string>("");
	const [unassignedDevices, setUnassignedDevices] = useState<UnassignedDevice[]>([]);

	useEffect(() => {
		api.device.unassignedDevicesList({ withCredentials: true }).then((res) => {
			setUnassignedDevices(res.data);
		});
	}, []);

	const handleCreateDevice = () => {
		if (newDevice && newDeviceName) {
			api.device.assignDeviceToUserCreate(
				{ deviceId: newDevice, deviceName: newDeviceName },
				{ withCredentials: true }
			)
			.then(() => {
				return api.device.unassignedDevicesList({ withCredentials: true });
			})
			.then((res) => {
				refresh();
				setUnassignedDevices(res.data);
				setNewDevice("default");
				setNewDeviceName("");
				window.location.reload();
			})
			.catch((error) => {
				console.error("Error creating device:", error);
			});
		}

		// Close the sheet
		document.querySelector('.SheetClose')?.dispatchEvent(
			new MouseEvent('click', { bubbles: true })
		);
	};

	return (
		<Sheet>
			<SheetTrigger>
				<div className="flex justify-center items-center bg-dark300 text-light200 rounded-full aspect-square h-10 hover:bg-primary hover:text-dark100">
					<CirclePlus size={20} strokeWidth={1.5} />
				</div>
			</SheetTrigger>

			<SheetContent>
				<DialogTitle></DialogTitle>
				<div className="flex flex-col justify-between h-full w-full py-5">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col">
							<div className="text-xl text-light100">New Device</div>
							<div className="text-sm text-light200">Add a device to your account</div>
						</div>

						<div className="flex flex-col gap-10">
							<select
								value={newDevice}
								className="w-full bg-dark300 text-light200 p-3 rounded-xl"
								onChange={(e) => setNewDevice(e.target.value)}
							>
								<option value="default" disabled>Select Your Devices</option>
								{unassignedDevices.map((device) => (
									<option key={device.id} value={device.id}>
										{device.id}
									</option>
								))}
							</select>

							<TextInput
								parentClassName="flex flex-col gap-2 w-full text-light200"
								titleClassName="text-light100 text-sm"
								inputType={InputTypeEnum.text}
								inputTitle="Device Name"
								setInput={setNewDeviceName}
								input={newDeviceName}
							/>
						</div>
					</div>

					<button className="flex items-center justify-center gap-2 text-sm text-dark100 bg-primary rounded-full px-5 h-10" onClick={handleCreateDevice}>
						<div className="text-sm">Add Device</div>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
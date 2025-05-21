import { InputTypeEnum, TextInput } from "@components/inputs/textInput";
import { Sheet, SheetClose, SheetTrigger } from "@components/shadcn-ui/ui/sheet";
import { SheetContent } from "@components/Sheets/components/sheetContent";
import { GreenHouseData, useGetMyDevices } from "@hooks/devices/MyDevices";
import { DialogTitle } from "@radix-ui/react-dialog";
import useEditorStore from "@store/Editor/editor.store";
import { Settings } from "lucide-react";
import { useEffect } from "react";

export const EditDevice = () => {
	const { selectedGH } = useEditorStore();
    const { data, loading } = useGetMyDevices();
    const greenHouseMap = Object.fromEntries(data.map(gh => [gh.id, gh]));

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
							<TextInput parentClassName="flex flex-col gap-2 w-full text-light200" titleClassName="text-light100 text-sm" inputType={InputTypeEnum.text} inputTitle="Device Name" setInput={() => {}} input={""} />

							<TextInput parentClassName="flex flex-col gap-2 w-full text-light200" titleClassName="text-light100 text-sm" inputType={InputTypeEnum.number} inputTitle="Device Sensor Rate" setInput={() => {}} input={""} />

							<button className="flex items-center justify-center gap-2 text-sm text-light100 bg-danger rounded-full px-5 h-10">
								<div className="text-sm">Delete Device</div>
							</button>
						</div>
					</div>


					<SheetClose className="flex items-center justify-center gap-2 text-sm text-dark100 bg-primary rounded-full px-5 h-10">
						<div className="text-sm">Save Changes</div>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
};
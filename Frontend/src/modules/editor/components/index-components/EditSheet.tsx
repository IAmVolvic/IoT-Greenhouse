import { Sheet, SheetClose, SheetTrigger } from "@components/shadcn-ui/ui/sheet";
import { Filter } from "lucide-react";
import { SheetContent } from "@components/Sheets/components/sheetContent";
import { DialogTitle } from "@radix-ui/react-dialog";
export const EditSheet = () => {
	return (
		<Sheet>
			<SheetTrigger className="bg-dark100 rounded-xl px-5 pointer-events-auto">
				<Filter size={16} strokeWidth={1.5} className="text-light100" />
			</SheetTrigger>

			<SheetContent>
				<DialogTitle></DialogTitle>
				<div className="flex flex-col justify-between h-full w-full py-5">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col">
							<div className="text-xl text-light100">Cool Title</div>
							<div className="text-sm text-light200">Something cool goes here</div>
						</div>

						<div className="flex flex-col gap-5">
						</div>
					</div>


					<SheetClose className="flex items-center justify-center gap-2 text-sm text-light100 bg-dark200 rounded-full px-5 h-10">
						<div className="text-light100 text-sm">Close</div>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
};
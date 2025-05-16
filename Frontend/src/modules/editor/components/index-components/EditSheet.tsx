import { Sheet, SheetClose, SheetTrigger } from "@components/shadcn-ui/ui/sheet";
import { SheetContent } from "@components/Sheets/components/sheetContent";
import { DialogTitle } from "@radix-ui/react-dialog";
export const EditSheet = () => {
	return (
		<Sheet>
			<SheetTrigger>
				<div className="bg-primary rounded-full px-3 py-1 text-sm text-dark100">View</div>
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
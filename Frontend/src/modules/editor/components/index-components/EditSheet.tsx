import { Sheet, SheetTrigger } from "@components/shadcn-ui/ui/sheet";
import { Filter, FilterX } from "lucide-react";
import { SheetContent } from "@components/Sheets/components/sheetContent";
import { DialogTitle } from "@radix-ui/react-dialog";
export const EditSheet = () => {
	return (
		<Sheet>
			<SheetTrigger className="bg-dark200 rounded-xl px-5">
				<Filter size={16} strokeWidth={1.5} className="text-light200" />
			</SheetTrigger>

			<SheetContent>
				<DialogTitle></DialogTitle>
				<div className="flex flex-col justify-between h-full w-full py-5">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col">
							<div className="text-xl text-light100">Advanced Filters</div>
							<div className="text-sm text-light200">Use these advanced filters to quickly refine your search and find specific user.</div>
						</div>

						<div className="flex flex-col gap-5">
						</div>
					</div>


					<button className="flex items-center justify-center gap-2 text-sm text-light100 bg-dark100 rounded-full px-5 h-10">
						<FilterX size={20} strokeWidth={1.5} />
						<div className="text-light100 text-sm">Clear Filters</div>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
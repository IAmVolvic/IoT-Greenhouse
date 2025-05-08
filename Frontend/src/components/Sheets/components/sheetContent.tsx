import { SheetClose, SheetContent as ShadcnSheetContent } from "@components/shadcn-ui/ui/sheet";
import { X } from "lucide-react";

interface SheetContentProps {
    children: React.ReactNode;
}

export const SheetContent = (props: SheetContentProps) => {
    return (
        <ShadcnSheetContent className="border-0 py-5 px-0 pr-5">
            <div className="bg-dark100 rounded-3xl shadow-md w-full h-full p-5">
                <div className="flex justify-end w-full">
                    <SheetClose className="outline-none"><X size={20} strokeWidth={1.5} className="text-light200" /></SheetClose>
                </div>

                {props.children}
            </div>

        </ShadcnSheetContent>
    )
}
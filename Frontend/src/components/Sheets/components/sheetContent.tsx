import { SheetClose, SheetContent as ShadcnSheetContent } from "@components/shadcn-ui/ui/sheet";
import { X } from "lucide-react";

interface SheetContentProps {
    children: React.ReactNode;
}

export const SheetContent = (props: SheetContentProps) => {
    return (
        <ShadcnSheetContent className="bg-dark300 border-0">
            <div className="flex justify-end w-full">
                <SheetClose className="outline-none"><X size={20} strokeWidth={1.5} /></SheetClose>
            </div>

            {props.children}
        </ShadcnSheetContent>
    )
}
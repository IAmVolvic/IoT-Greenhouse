import { LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn-ui/ui/popover";
import { useLogout } from "@hooks/authentication/useLogout";
import { useAuth } from "@hooks/authentication/useAuthentication";

export const UsersTableOptions = () => {
    const { user } = useAuth();
    const Logout = useLogout();
        
    return (
        <Popover>
            <PopoverTrigger>
                <div className={`flex flex-row items-center justify-end h-10 pr-2`}>
                    <div className={`flex flex-row items-center gap-3 h-full`}>
                        <div className="border-1.5 border-primary w-full h-full rounded-full flex justify-center items-center">
                            <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.name}`} alt="UICON" className="h-full aspect-square" />
                        </div>

                        <div className="flex flex-col items-start justify-center">
                            <div className="text-light200 text-sm capitalize"> {user?.name} </div>
                            <div className="text-light200 text-xs capitalize"> {user?.role?.toString().toLowerCase()} </div>
                        </div>
                    </div>
                </div>
            </PopoverTrigger>

            <PopoverContent align="end" className="flex flex-col bg-dark300 border-0.05r border-stroke/10 rounded-2xl p-2 w-52">
                <button className={`flex flex-row items-center gap-2 hover:bg-light200/10 rounded-xl p-2`} onClick={Logout}>
                    <LogOut size={20} strokeWidth={1.5} className="text-danger" />
                    <div className="text-sm text-danger">Logout</div>
                </button>

            </PopoverContent>
        </Popover>
    )
}
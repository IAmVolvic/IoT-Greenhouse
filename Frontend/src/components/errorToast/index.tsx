import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const ErrorToast = (error: AxiosError) => {
    if (error.response && error.response.data && (error.response.data as any).errors) {
        let errorMessage = '';
        
        // Iterate over the error fields
        Object.keys((error.response.data as any).errors).forEach((field) => {
            // Type message as string
            (error.response?.data as any).errors[field].forEach((message: string) => {
                errorMessage += `${field}: ${message}\n`; 
            });
        });

        // Show the error message using the toast
        toast.error(errorMessage);
    }
};
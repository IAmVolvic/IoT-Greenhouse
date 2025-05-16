import { useQuery } from "@tanstack/react-query";
import { Api } from "@Api";
import { LucideIcon } from "lucide-react";
import * as THREE from "three";
import { greenHouseTable, transformData } from "@modules/editor/data/GreenhouseData";
import { useEffect } from "react";

// Interfaces
export interface GreenHouseData {
    id: string;
    name: string;
    position: THREE.Vector3;
    labelPosition: THREE.Vector3;
    SensorInfo: SensorInfo[];
}

export interface SensorInfo {
    name: string;
    value: number;
    position: THREE.Vector3;
    icon: LucideIcon;
}

const API = new Api();

export const useGetMyDevices = () => {
    const { refetch, isFetching, data, isSuccess, isError } = useQuery({
        queryKey: ["user-devices"],
        
        queryFn: async () => {
            const res = await API.device.myDevicesList({withCredentials: true});
            return res.data;
        },

        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    // Handle success response
    useEffect(() => {
        if (isSuccess && data && !isFetching) {
            transformData(data);
        }
    }, [isSuccess, data, isFetching]);

    // Handle error response
    useEffect(() => {
        if (isError && !isFetching) {
            greenHouseTable.splice(0, greenHouseTable.length);
        }
    }, [isError, isFetching]);

    return {
        data: greenHouseTable as GreenHouseData[],
        refresh: refetch,
        loading: isFetching,
        isSuccess: isSuccess,
        isError: isError,
    };
};
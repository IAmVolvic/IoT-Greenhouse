import { useQuery } from "@tanstack/react-query";
import { Api } from "@Api";
import { LucideIcon } from "lucide-react";
import * as THREE from "three";
import { transformData } from "@modules/editor/data/GreenhouseData";
import { useEffect } from "react";
import { useGreenhouseStore } from "@store/Editor/devices.store";

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
    _v?: number;
    position: THREE.Vector3;
    icon: LucideIcon;
}

const API = new Api();

export const useGetMyDevices = () => {
    const { setGreenhouses, greenhouses } = useGreenhouseStore();

    const { refetch, isFetching, data, isSuccess, isError } = useQuery({
        queryKey: ["user-devices"],

        queryFn: async () => {
            const res = await API.device.myDevicesList({ withCredentials: true });
            return res.data;
        },

        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess && data && !isFetching) {
            transformData(data);
        }
    }, [isSuccess, data, isFetching]);

    useEffect(() => {
        if (isError && !isFetching) {
            setGreenhouses([]);
        }
    }, [isError, isFetching, setGreenhouses]);

    return {
        data: greenhouses,
        refresh: refetch,
        loading: isFetching,
        isSuccess,
        isError,
    };
};
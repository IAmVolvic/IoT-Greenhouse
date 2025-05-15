import { create } from "zustand";
import { GreenHouseData } from "@hooks/devices/MyDevices";

interface GreenhouseState {
    greenhouses: GreenHouseData[];
    setGreenhouses: (data: GreenHouseData[]) => void;
    updateSensorValue: (deviceId: string, unit: string, value: number) => void;
}

export const useGreenhouseStore = create<GreenhouseState>()((set) => ({
    greenhouses: [],
    setGreenhouses: (data) => set({ greenhouses: data }),

    updateSensorValue: (deviceId, unit, value) => {
        set((state) => ({
            greenhouses: state.greenhouses.map((gh) => {
                if (gh.id !== deviceId) return gh;
                return {
                    ...gh,
                    SensorInfo: gh.SensorInfo.map((sensor) =>
                        sensor.name === unit ? { ...sensor, value } : sensor
                    )
                };
            })
        }));
    },
}));
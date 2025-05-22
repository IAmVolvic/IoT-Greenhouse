import * as THREE from "three";
import { DeviceResponseDto } from "@Api";
import { GreenHouseData } from "@hooks/devices/MyDevices";
import { AlarmSmoke, Sun, Thermometer } from "lucide-react";
import { useGreenhouseStore } from "@store/Editor/devices.store";

export const transformData = (data: DeviceResponseDto[]): GreenHouseData[] => {
    const transformed = data.map((device, index) => {
        const offsetX = index * 10;

        return {
            id: device.id || `unknown-id-${index}`,
            name: device.deviceName || "Unknown Device",
            deviceRate: device.deviceRate || 0,
            position: new THREE.Vector3(offsetX, 0, 0),
            labelPosition: new THREE.Vector3(offsetX, 2.5, -2.7),
            SensorInfo: [
                {
                    name: "gas",
                    value: 0,
                    position: new THREE.Vector3(offsetX, 1, -1.5),
                    icon: AlarmSmoke,
                },
                {
                    name: "temperature",
                    value: 0,
                    position: new THREE.Vector3(offsetX, 1, 0),
                    icon: Thermometer,
                },
                {
                    name: "light",
                    value: 0,
                    position: new THREE.Vector3(offsetX, 1, 1.5),
                    icon: Sun,
                },
            ],
        };
    });

    // Set store state
    useGreenhouseStore.getState().setGreenhouses(transformed);

    return transformed;
};
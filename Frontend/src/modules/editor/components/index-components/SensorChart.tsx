import { LucideIcon } from "lucide-react";
import { LChartData, LineChart } from "./ChartLine";
import { useEffect, useState } from "react";

interface SensorChartProps {
    sensorName: string;
    data: number;
    tick?: number;
    icon: LucideIcon;
    numberToShow: number;
}

export const SensorChart = (props: SensorChartProps) => {
    const [chartData, setChartData] = useState<LChartData>({
        Label: [],
        Data: []
    });

    useEffect(() => {
        if (!props.data) return;

        setChartData((prev: LChartData): LChartData => {
            const newLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const newValue = props.data;

            const updatedLabels = [...prev.Label, newLabel].slice(-props.numberToShow);
            const updatedData = [...prev.Data, newValue].slice(-props.numberToShow);

            return {
                Label: updatedLabels,
                Data: updatedData
            };
        });
    }, [props.data, props.numberToShow, props.tick]);

    return (
        <div className="flex flex-col gap-3 pointer-events-auto">
            {/* Icon - Title - Button */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-5">
                    <div className="bg-dark300 w-12 aspect-square rounded-xl flex items-center justify-center">
                        <props.icon size={20} strokeWidth={1.5} className="text-light200" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="text-md text-light100 capitalize">{props.sensorName}</div>
                        <div className="text-sm text-light200">Current rate: 1000ms</div>
                    </div>
                </div>
            </div>
            
            <LineChart Data={chartData.Data} Label={chartData.Label} />
        </div>
    );
};
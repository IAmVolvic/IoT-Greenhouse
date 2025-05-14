import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
	ChartOptions,
	ChartData,
	Plugin,
	TooltipModel,
	Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRef, useEffect, useState } from 'react';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const enableLegendContainer = false;
const enableToolTips = true;

function createGradient(ctx: CanvasRenderingContext2D): [CanvasGradient, string] {
    const blueColor = "#89affb";
    const r = parseInt(blueColor.slice(1, 3), 16);
    const g = parseInt(blueColor.slice(3, 5), 16);
    const b = parseInt(blueColor.slice(5, 7), 16);

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
    gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    return [gradient, blueColor];
}

const externalTooltipHandler = (context: { chart: ChartJS, tooltip: TooltipModel<'line'> }) => {
	const { chart, tooltip } = context;
	let tooltipEl = document.getElementById('chartjs-tooltip') as HTMLDivElement;

	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.id = 'chartjs-tooltip';
		tooltipEl.className = 'bg-dark300 text-light100 rounded-xl shadow-sm p-3 min-w-36 z-[100]';
		
		tooltipEl.style.pointerEvents = 'none';
		tooltipEl.style.opacity = '0';
		tooltipEl.style.position = 'absolute';
		tooltipEl.style.transform = 'translate(-50%, 0)';
		tooltipEl.style.transition = 'all .2s ease';

		const table = document.createElement('table');
		table.className = 'w-full';
		tooltipEl.appendChild(table);
		document.body.appendChild(tooltipEl);
	}

	if (tooltip.opacity === 0) {
		tooltipEl.style.opacity = '0';
		return;
	}

	const titleLines = tooltip.title || [];
	const bodyLines = tooltip.body.map(b => b.lines);

	const tableHead = document.createElement('thead');
	titleLines.forEach(title => {
		const tr = document.createElement('tr');
		const th = document.createElement('th');
		th.className = 'text-sm font-semibold text-start';
		th.appendChild(document.createTextNode(title));
		tr.appendChild(th);
		tableHead.appendChild(tr);
	});

	const tableBody = document.createElement('tbody');
	tableBody.className = 'text-xs text-white';

	bodyLines.forEach((body, i) => {
		const innerData = body[0].split(":").map(value => value.trim());
		const colors = tooltip.labelColors[i];
		const span = document.createElement('span');
		span.className = 'rounded-full mr-3';
		span.style.background = 'pointStyle' in colors ? colors.backgroundColor as string : colors.borderColor as string;
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.display = 'inline-block';

		const tr = document.createElement('tr');
		const td1 = document.createElement('td');
		td1.className = 'text-sm';
		td1.appendChild(span);
		td1.appendChild(document.createTextNode(innerData[0]));

		const td2 = document.createElement('td');
		td2.className = 'text-sm text-end pl-2';
		td2.appendChild(document.createTextNode(innerData[1]));

		tr.appendChild(td1);
		tr.appendChild(td2);
		tableBody.appendChild(tr);
	});

	const tableRoot = tooltipEl.querySelector('table');
	if (tableRoot) {
		while (tableRoot.firstChild) {
			tableRoot.firstChild.remove();
		}
		tableRoot.appendChild(tableHead);
		tableRoot.appendChild(tableBody);
	}

	const rect = chart.canvas.getBoundingClientRect();
	tooltipEl.style.opacity = '1';
	tooltipEl.style.left = rect.left + window.scrollX + tooltip.caretX + 'px';
	tooltipEl.style.top = rect.top + window.scrollY + tooltip.caretY + 'px';
	tooltipEl.style.fontSize = '12px';
	tooltipEl.style.fontFamily = 'sans-serif';
};

const htmlLegendPlugin: Plugin<'line'> = {
	id: 'htmlLegend',
	afterUpdate(chart, args, options) {
		const htmlLegendOptions = options as { containerID: string };
		const legendContainer = document.getElementById(htmlLegendOptions.containerID)!;
		let list = legendContainer.querySelector('ul');
		if (!list) {
			list = document.createElement('ul');
			list.style.display = 'flex';
			list.style.flexDirection = 'column';
			list.style.margin = '0';
			list.style.padding = '0';
			legendContainer.appendChild(list);
		}

		while (list.firstChild) list.firstChild.remove();

		const items = chart.options.plugins?.legend?.labels?.generateLabels?.(chart) ?? [];

		items.forEach((item) => {
			const li = document.createElement('li');
			li.style.display = 'flex';
			li.style.alignItems = 'center';
			li.style.cursor = 'pointer';
			li.style.marginBottom = '10px';

			li.onclick = () => {
				if (typeof item.datasetIndex === 'number') {
					chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
					chart.update();
				}
			};

			const boxSpan = document.createElement('span');
			boxSpan.style.display = 'flex';
			boxSpan.style.background = item.hidden ? (item.fillStyle as string) : (item.strokeStyle as string);
			boxSpan.style.border = `2px solid ${item.strokeStyle as string}`;
			boxSpan.style.borderRadius = '5px';
			boxSpan.style.marginRight = '10px';
			boxSpan.style.height = '20px';
			boxSpan.style.width = '20px';

			const textContainer = document.createElement('p');
			textContainer.style.color = item.hidden ? '#aaa' : 'white';
			textContainer.style.margin = '0';
			textContainer.appendChild(document.createTextNode(item.text));

			li.appendChild(boxSpan);
			li.appendChild(textContainer);
			list.appendChild(li);
		});
	},
};

type CustomChartOptions = ChartOptions<'line'> & {
	plugins: {
		htmlLegend: {
			containerID: string;
		};
	} & ChartOptions<'line'>['plugins'];
};

const options: CustomChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	animation: false,
	interaction: {
		mode: 'index',
		intersect: false,
	},
	plugins: {
		htmlLegend: enableLegendContainer ? { containerID: 'legend-container' } : { containerID: '' },
		legend: {
			display: false,
		},
		tooltip: enableToolTips
			? {
					enabled: false,
					mode: 'index',
					intersect: false,
					external: externalTooltipHandler,
			  }
			: {
					enabled: false,
			  },
	},
	scales: {
		x: {
			display: false,
			border: { display: false },
			ticks: { color: 'white' },
			grid: { display: false },
		},
		y: {
			display: true,
			position: 'left',
			border: { display: false },
			ticks: {
				color: 'white',
				autoSkip: true,
				maxTicksLimit: 5,
			},
			grid: { display: false },
		},
	},
};

export interface LChartData {
	Label: string[];
	Data: number[];
}

export const LineChart = (props: LChartData) => {
	const chartRef = useRef<ChartJS<'line'> | null>(null);
	const [chartData, setChartData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: [],
	});
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (enableLegendContainer) {
			ChartJS.register(htmlLegendPlugin);
		}
	}, []);

	useEffect(() => {
		if (!isClient) return;

		const chart = chartRef.current;
		if (!chart) return;

		return () => {
			const tooltipEl = document.getElementById('chartjs-tooltip');
			if (tooltipEl) tooltipEl.remove();

			const legendContainer = document.getElementById('legend-container');
			if (legendContainer) legendContainer.innerHTML = '';

			if (chart) chart.destroy();
		};
	}, [isClient]);

	useEffect(() => {
		const chart = chartRef.current;
		if (!chart) return;

		const ctx = chart.ctx;
		if (!ctx) return;

		const [gradient, borderColor] = createGradient(ctx);

		setChartData({
			labels: props.Label,
			datasets: [
				{
					label: 'Moisture',
					data: props.Data,
					borderWidth: 2,
					tension: 0,
					pointRadius: 2,
					borderColor,
					backgroundColor: gradient,
					fill: false,
				},
			],
		});

	}, [props.Label, props.Data]);

	return (
		<div className="w-full h-32">
			{isClient && (
				<>
					<Line ref={chartRef} options={options as ChartOptions<'line'>} data={chartData} />
					<div id="legend-container" style={{ marginTop: '1rem' }} />
				</>
			)}
		</div>
	);
};




/* export const LineChart = () => {
	const chartRef = useRef<ChartJS<'line'> | null>(null);
	const [chartData, setChartData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: [],
	});
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (enableLegendContainer) {
			ChartJS.register(htmlLegendPlugin);
		}
	}, []);

	useEffect(() => {
		if (!isClient) return;

		const chart = chartRef.current;
		if (!chart) return;

		const ctx = chart.ctx;
        if (!ctx) return;

		const [gradient, borderColor] = createGradient(ctx);

		setChartData({
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			datasets: [
				{
					label: 'Moisture',
					data: randomData(0, 1000, 12),
					borderWidth: 3,
					tension: 0,
					borderColor,
					backgroundColor: gradient,
					fill: true,
				}
			],
		});

		return () => {
			const tooltipEl = document.getElementById('chartjs-tooltip');
			if (tooltipEl) tooltipEl.remove();

			const legendContainer = document.getElementById('legend-container');
			if (legendContainer) legendContainer.innerHTML = '';

			setChartData({ labels: [], datasets: [] });

			if (chart) chart.destroy();
		};
	}, [isClient]);

	return (
		<div className="w-full h-32">
			{isClient && (
				<>
					<Line ref={chartRef} options={options as ChartOptions<'line'>} data={chartData} />
					<div id="legend-container" style={{ marginTop: '1rem' }} />
				</>
			)}
		</div>
	);
}; */
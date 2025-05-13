function randGradient(seed, Obj) {
    var Color = Math.floor((Math.abs(Math.sin(seed + 6) * 16777215)));
    const red = (Color & 0xff0000) >> 16;
    const green = (Color & 0x00ff00) >> 8;
    const blue = (Color & 0x0000ff) >> 0;

    const RGB_Jabit = `${red}, ${green}, ${blue}`;

    var gradient = Obj.get(0).getContext('2d').createLinearGradient(0, 0, 0, 450)
    gradient.addColorStop(0, `rgba(${RGB_Jabit}, 0.5)`);
    gradient.addColorStop(0.3, `rgba(${RGB_Jabit}, 0)`);
    gradient.addColorStop(1, `rgba(${RGB_Jabit}, 0)`);

    return [gradient, `rgba(${RGB_Jabit}, 1)`];
}

const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.margin = 0;
        listContainer.style.padding = 0;

        legendContainer.appendChild(listContainer);
    }

    return listContainer;
};

const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach(item => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginBottom = '10px';

            li.onclick = () => {
                const { type } = chart.config;
                if (type === 'pie' || type === 'doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('span');
            boxSpan.style.display = 'flex';

            boxSpan.style.background = item.hidden ? item.fillStyle : item.strokeStyle;

            boxSpan.style.borderColor = item.strokeStyle;
            boxSpan.style.borderWidth = '2px';
            boxSpan.style.borderRadius = '5px';

            // boxSpan.style.flexShrink = 0;

            boxSpan.style.marginRight = '10px';

            boxSpan.style.height = '20px';
            boxSpan.style.width = '20px';


            boxSpan.innerHTML = `<ion-icon style="display: ${item.hidden ? 'none' : 'block'};" name="checkmark-outline"></ion-icon>`;

            // Text
            const textContainer = document.createElement('p');
            textContainer.style.color = item.hidden ? item.fontColor : 'white';
            textContainer.style.margin = 0;
            textContainer.style.padding = 0;
            // textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });
    }
};


const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');

        tooltipEl.className = 'pixelBorder border-neutral-700 volvic-Rounded shadow-sm bg-zinc-800 lg:w-56 py-2 px-3';

        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .2s ease';

        const table = document.createElement('table');
        table.className = 'w-full';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
};

const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map(b => b.lines);

        const tableHead = document.createElement('thead');

        titleLines.forEach(title => { 
            const tr = document.createElement('tr');
            
            const th = document.createElement('th');
            th.className = 'text-sm font-semibold';

            const text = document.createTextNode(title);
            th.appendChild(text);

            tr.appendChild(th);
            tableHead.appendChild(tr);
        });

        const tableBody = document.createElement('tbody');
        tableBody.className = 'volvic-tb';


        bodyLines.forEach((body, i) => {
            const innerData = body[0].split(":").map(function (value) {
                return value.trim();
            });

            const colors = tooltip.labelColors[i];

            const span = document.createElement('span');
            span.className = 'rounded-full mr-3';

            span.style.background = colors.borderColor;
            span.style.height = '10px';
            span.style.width = '10px';
            span.style.display = 'inline-block';



            const tr = document.createElement('tr');
            tr.className = 'd-flex flex-row justify-between';

            const td_1 = document.createElement('td');
            td_1.className = 'text-sm';

            const td_2 = document.createElement('td');
            td_2.className = 'text-sm';

            td_1.appendChild(span);
            td_1.appendChild(document.createTextNode(innerData[0]));

            td_2.appendChild(document.createTextNode(innerData[1]));

            tr.appendChild(td_1);
            tr.appendChild(td_2);

            
            tableBody.appendChild(tr);
        });

        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
};




const charts = {
    Chart_Dashboard_1: async () => {
        // Get the chat Object
        const ChartOBJ = $('#dash_Impressions');

        let options = {
            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    enabled: false,
                    position: 'average',
                    external: externalTooltipHandler,
                }
            },

            maintainAspectRatio: false,
            responsive: true,

            interaction: {
                mode: 'index',
                intersect: false,
            },

            stacked: false,

            scales: {
                x: {
                    display: true,
                    border: { display: false },
                    ticks: {
                        fontColor: "white"
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    border: { display: false },
                    ticks: {
                        fontColor: "white",
                        beginAtZero: true,
                        stepSize: 1,
                        autoSkip: true,
                        maxTicksLimit: 5
                    },
                    grid: {
                        display: true
                    }
                },
            }
        }

        const randomIntArrayInRange = (min, max, n = 1) =>
        Array.from(
            { length: n },
            () => Math.floor(Math.random() * (max - min + 1)) + min
        );

        let response = [
            [
                'Aug 1',
                'Aug 2',
                'Aug 3',
                'Aug 4',
                'Aug 5',
                'Aug 6',
                'Aug 7',
                'Aug 8',
                'Aug 9',
                'Aug 10',
                'Aug 11',
                'Aug 12',
            ],

            [
                'EU',
                'US',
                'DK',
                'UK'
            ]
        ]


        let data = {
            labels: response[0],
            datasets: randomIntArrayInRange(1, 1000, 4).map((item, index) => {
                let colorThing = randGradient(index, ChartOBJ)
                return {
                    label: response[1][index],
                    data: randomIntArrayInRange(1, 100, 12),
                    backgroundColor: colorThing[0],
                    fill: true,
                    borderColor: colorThing[1],
                    borderWidth: 3,
                    tension: 0
                }
            })
        }

        new Chart(ChartOBJ, { type: 'line', options: options, data: data });
    },


    Chart_viewCampaign_1: async () => {
        // Get the chat Object
        const ChartOBJ = $('#viewCampaign_Chart');

        let options = {
            plugins: {
                htmlLegend: {
                    // ID of the container to put the legend in
                    containerID: 'legend-container',
                },

                legend: {
                    display: false
                },

                legendCallback: function (chart) {
                    // Return the HTML string here.
                    console.log(chart.data.datasets);
                    var text = [];
                    text.push('<ul class="' + chart.id + '-legend">');
                    for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                        text.push('<li><span id="legend-' + i + '-item" style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '"   onclick="updateDataset(event, ' + '\'' + i + '\'' + ')">');
                        if (chart.data.labels[i]) {
                            text.push(chart.data.labels[i]);
                        }
                        text.push('</span></li>');
                    }
                    text.push('</ul>');
                    return text.join("");
                },

                tooltip: {
                    enabled: false,
                    position: 'average',
                    external: externalTooltipHandler,
                }
            },

            maintainAspectRatio: false,
            responsive: true,

            interaction: {
                mode: 'index',
                intersect: false,
            },

            stacked: false,

            scales: {
                x: {
                    display: true,
                    border: { display: false },
                    ticks: {
                        fontColor: "white"
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    border: { display: false },
                    ticks: {
                        fontColor: "white",
                        beginAtZero: true,
                        stepSize: 1,
                        autoSkip: true,
                        maxTicksLimit: 5
                    },
                    grid: {
                        display: true
                    }
                },
            }
        }


        const randomIntArrayInRange = (min, max, n = 1) =>
            Array.from(
                { length: n },
                () => Math.floor(Math.random() * (max - min + 1)) + min
            );

        let response = [
            [
                'Aug 1',
                'Aug 2',
                'Aug 3',
                'Aug 4',
                'Aug 5',
                'Aug 6',
                'Aug 7',
                'Aug 8',
                'Aug 9',
                'Aug 10',
                'Aug 11',
                'Aug 12',
            ],

            [
                'EU',
                'US',
                'DK',
                'UK'
            ]
        ]


        let data = {
            labels: response[0],
            datasets: randomIntArrayInRange(1, 1000, 4).map((item, index) => {
                let colorThing = randGradient(index, ChartOBJ)
                return {
                    label: response[1][index],
                    data: randomIntArrayInRange(1, 100, 12),
                    backgroundColor: colorThing[0],
                    fill: true,
                    borderColor: colorThing[1],
                    borderWidth: 3,
                    tension: 0
                }
            })
        }

        new Chart(ChartOBJ, { type: 'line', options: options, data: data, plugins: [htmlLegendPlugin] });
    }

}
export { charts };
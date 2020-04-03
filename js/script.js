document.addEventListener("DOMContentLoaded", function () {
    const width = 1000;
    const height = 500;
    const margin = 40;
    const svg = d3.select('#svg-container')
        .attr('width', width)
        .attr('height', height);

    let xParam = 'fertility-rate';
    let yParam = 'child-mortality';
    let rParam = 'gdp';
    let year = '2000';

    const xScale = d3.scaleLinear().range(([margin * 2, width - margin]));
    const yScale = d3.scaleLinear().range([height - margin, margin]);
    const colorScale = d3.scaleOrdinal().range(['aqua', 'lime', 'gold', 'hotpink']);
    const rScale = d3.scaleLinear().range([2, 10]);

    xAxis = svg.append('g').attr('transform', `translate(0, ${height - margin})`);
    yAxis = svg.append('g').attr('transform', `translate(${margin * 2}, 0)`);

    const xLabel = svg.append('text').attr('transform', `translate(${width / 2}, ${height})`);
    const yLabel = svg.append('text').attr('transform', `translate(${margin}, ${height / 2}) rotate(-90)`);

    loadData().then(data => {
        console.log(data);
        d3.select('#year-input').on('change', function () {
            year = this.value;
            updateChart(data);
        });

        const select = d3.select('#radius-select');
        const params = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population'];
        params.forEach(p => select.append("option").attr('value', p).text(p));
        select.on('change', function () {
            rParam = this.value;
            updateChart(data);
        });

        updateChart(data);
    });

    function updateChart(data) {
        xLabel.text(xParam);
        yLabel.text(yParam);
        d3.select('#year-label').text(year);

        let xRange = data.map(d => +d[xParam][year]);
        let yRange = data.map(d => +d[yParam][year]);
        let rRange = data.map(d => +d[rParam][year]);
        xScale.domain([d3.min(xRange), d3.max(xRange)]);
        yScale.domain([d3.min(yRange), d3.max(yRange)]);
        rScale.domain([d3.min(rRange), d3.max(rRange)]);
        xAxis.call(d3.axisBottom(xScale));
        yAxis.call(d3.axisLeft(yScale));

        svg.selectAll('circle').data(data).enter()
            .append("circle")
            .attr('cx', (d, i) => xScale(+d[xParam][year]))
            .attr('cy', (d, i) => yScale(+d[yParam][year]))
            .attr('r', (d, i) => rScale(+d[rParam][year]))
            .attr('fill', (d, i) => colorScale(d['region']));

        svg.selectAll('circle').data(data)
            .attr('cx', (d, i) => xScale(+d[xParam][year]))
            .attr('cy', (d, i) => yScale(+d[yParam][year]))
            .attr('r', (d, i) => rScale(+d[rParam][year]))
            .attr('fill', (d, i) => colorScale(d['region']));
    }

    async function loadData() {
        const population = await d3.csv('data/pop.csv');
        const rest = {
            'gdp': await d3.csv('data/gdppc.csv'),
            'child-mortality': await d3.csv('data/cmu5.csv'),
            'life-expectancy': await d3.csv('data/life_expect.csv'),
            'fertility-rate': await d3.csv('data/tfr.csv')
        };

        return population.map(d => {
            return {
                geo: d.geo,
                country: d.country,
                region: d.region,
                population: {...d},
                ...Object.values(rest).map(v => v.find(r => r.geo === d.geo))
                    .reduce((o, d, i) => ({
                        ...o,
                        [Object.keys(rest)[i]]: d
                    }), {})
            }
        })
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const width = 1000;
    const height = 500;
    const margin = 40;
    const svg = d3.select('#svg-container')
        .attr('width', width)
        .attr('height', height);

    const xScale = d3.scaleLinear().range(([margin * 2, width - margin]));
    const yScale = d3.scaleLinear().range([height - margin, margin]);

    xAxis = svg.append('g').attr('transform', `translate(0, ${height - margin})`);
    yAxis = svg.append('g').attr('transform', `translate(${margin * 2}, 0)`);

    const xLabel = svg.append('text').attr('transform', `translate(${width / 2}, ${height})`);
    const yLabel = svg.append('text').attr('transform', `translate(${margin}, ${height / 2}) rotate(-90)`);

    xLabel.text("xLabel");
    yLabel.text("yLabel");

    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));

});
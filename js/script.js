(function (d3) {
    const width = 1000;
    const height = 500;
    const svg = d3.select('#svg-container')
        .attr('width', width)
        .attr('height', height);

    const xLabel = svg.append('text');
    xLabel.text("Hello");


    d3.select("body").append("span")
        .text("Hello, world!");
})(d3);
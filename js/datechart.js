
var margin = {top: 75, right: 10, bottom: 70, left: 70},
    width = 1200,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
//var	parseDate = d3.zipcode.parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.data);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(d3.data);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("date.php", function(error, data) {

    data.forEach(function(d) {
        d.month= (d.month).substring(0,7);
        d.total_count = +d.total_count;
    }
    );
	
  x.domain(data.map(function(d) { return d.month; }));

  y.domain([0, d3.max(data, function(d) { return d.total_count; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
   
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
       //

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("number of crashes");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.month); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.total_count); })
      .attr("height", function(d) { return height - y(d.total_count); });

});
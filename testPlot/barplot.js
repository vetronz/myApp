// Your beautiful D3 code will go here
var all_data = [1,2];
//var p_threshold = - Math.log10(0.05);
//var log2_threshold = 1;

colours = [
  "#000000",
  "#009292",
  "#FF6DB6",
  "#FFB6DB",
  "#490092",
  "#006DDB",
  "#B66DFF",
  "#B6DBFF",
  "#6DB6FF",
  "#920000",
  "#924900",
  "#DB6D00",
  "#24FE23",
  "#074751",
  "#FFFF6D"];

var run = function() {
  var dataset = [];
    for (var i = 1; i < all_data.length + 1; i++) {
      dataset.push(d3.csv("DGE_results_" + i + ".csv", function(dataset){
        dataset.gene_name = dataset[""];
        dataset.Base_Mean = parseFloat(dataset.baseMean);
        dataset.log2FoldChange = parseFloat(dataset.log2FoldChange);
        dataset.pvalue = parseFloat(dataset.pvalue);
        dataset.padj = parseFloat(dataset.padj);
        dataset.dataset = i;
        return dataset;
      }));
    };
  dataset = Promise.all(dataset);
  dataset.then(function(dataset){

    for(var i = 0; i < dataset.length; i++){
      dataset[i] = dataset[i].filter(function(d){return ! isNaN(d.padj);});
      dataset[i] = dataset[i].filter(function(d){return - Math.log10(d.padj) > p_threshold && (d.log2FoldChange > log2_threshold || d.log2FoldChange <  - log2_threshold);});
      dataset[i] = dataset[i].length;
    };

      //dataset = dataset.flat();
      dataset = [].concat.apply([], dataset);
      console.log(dataset);


      var margin = {top: 40, right: 20, bottom: 20, left: 40};
      //Width and height
      var w = 800 - margin.right - margin.left;
      var h = 800 - margin.top - margin.bottom;

      var xScale = d3.scaleBand().domain(d3.range(dataset.length))
      .rangeRound([0, w]) // <-- Also enables rounding
      .paddingInner(0.05);

      var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { return d;}) + 100])
      .range([h, 0]);

      var yAxis = d3.axisLeft()
      .scale(yScale);

      var svg = d3.select

      var yAxis = d3.axisLeft()
      .scale(yScale);

      var svg = d3.select("#painting")
      .append("svg")
      //.attr("width", w + margin.right + margin.left) // <-- Here
      //.attr("height", h + margin.top + margin.bottom)
      .attr("width", "100%") // <-- Here
      .attr("height", "100%")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");// <-- and here!
      svg.append("g")
      .attr("class", "axis") //Assign "axis" class
      .call(yAxis);

      var barPadding = 10;

      svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return xScale(i); // <-- Set x values
      })
      .attr("y", function(d){return yScale(d);})
      .attr("width", xScale.bandwidth())
      .attr("height", function(d){return h - yScale(d);})
      .attr("fill", function(d, i){return colours[i + 1];})
      /*.on("mouseover", function(d){
      svg.append("text")
          .attr("id", "label")
          .attr("x", d3.event.pageX)
          .attr("y", d3.event.pageY)
          .text("Significant genes: " + d);
      })
      .on("mouseout", function(){
        d3.select("#label").remove();
      })*/;
  })
}

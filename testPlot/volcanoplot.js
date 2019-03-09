// Your beautiful D3 code will go here
var all_data = [1];
var p_threshold = - Math.log10(0.05);
var log2_threshold = 1;

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







var volcanoplot = function() {
  var dataset = [];
    for (var i = 0; i < all_data.length; i++) {
      // dataset.push(d3.csv("DGE_results_" + all_data[i] + ".csv", function(dataset){
      var in_file = 'DGE_results_' + all_data[i] + '.csv'
      console.log(in_file)
      dataset.push(d3.csv(in_file, function(dataset){
        dataset.gene_name = dataset[""];
        dataset.Base_Mean = parseFloat(dataset.baseMean);
        dataset.log2FoldChange = parseFloat(dataset.log2FoldChange);
        dataset.pvalue = parseFloat(dataset.pvalue);
        dataset.padj = parseFloat(dataset.padj);
        // console.log(dataset[3])
        return dataset;
      }));
    };




  console.log('logging the dataset 1: ')
  console.log(dataset);

  dataset = Promise.all(dataset);

  dataset.then(function(dataset){
    for(var i = 0; i < dataset.length; i++){
      for(var e = 0; e < dataset[i].length; e++){
        dataset[i][e].dataset = i + 1;
      };
    };
    console.log('logging the dataset 2: ')
    console.log(dataset);
      // dataset = dataset.flat();
      dataset = [].concat.apply([], dataset);
      console.log('logging the dataset 3: ')
      console.log(dataset);
      dataset = dataset.filter(function(d){return ! isNaN(d.padj);});

      var margin = {top: 40, right: 20, bottom: 20, left: 40};
      //Width and height
      var w = 800 - margin.right - margin.left;
      var h = 800 - margin.top - margin.bottom;

      var xScale = d3.scaleLinear()
      .domain([d3.min(dataset, function(d) { return d.log2FoldChange - 0.5;}),
               d3.max(dataset, function(d) { return d.log2FoldChange + 0.5;})])
      .range([0, w]);

      var yScale = d3.scaleLinear()
      .domain([d3.min(dataset, function(d) { return - Math.log10(d.padj) - 0.5;}),
               d3.max(dataset, function(d) { return - Math.log10(d.padj) + 0.5;})])
      .range([h, 0]);

      var xAxis = d3.axisBottom()
      .scale(xScale);

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
      .attr("transform", "translate(0," + h + ")") // <-- and here!
      .call(xAxis);
      svg.append("g")
      .attr("class", "axis") //Assign "axis" class
      .call(yAxis)

      var circles = svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .on("click", function() {
      //Do something mundane and annoying on click
      alert("Hey, don't click that!");
      })
      .on("mouseover", function(d) {
        d3.select("#label").remove();
        d3.select(this)
        .attr("fill", "orange");
        svg.append("text")
          .attr("id", "label")
          .attr("y", h + margin.bottom + margin.top/4)
          .text("Gene: " + d.gene_name + " L2fc: " + d.log2FoldChange + " p adj: " + d.padj);
      })
      .on("mouseout", function(d){
        d3.select(this).attr("fill", function(d){
          if(- Math.log10(d.padj) > p_threshold && (d.log2FoldChange > log2_threshold || d.log2FoldChange <  - log2_threshold)){
            return colours[d.dataset];
          } else {
            return "grey";
          };
        });
      });

      circles.attr("cx", function(d) {
      return xScale(d.log2FoldChange);
      })
      .attr("cy",function(d){
        return yScale(- Math.log10(d.padj));
      })
      .attr("r", 5)
      .attr("fill", function(d){
        if(- Math.log10(d.padj) > p_threshold && (d.log2FoldChange > log2_threshold || d.log2FoldChange <  - log2_threshold)){
          return colours[d.dataset];
        } else {
          return "grey";
        };
      });

      var v_lines_g = svg.append("g")
      .attr("class", "lines");

      var h_lines_g = svg.append("g")
      .attr("class", "lines");

      v_lines = [- log2_threshold, log2_threshold]
      var v_lines = v_lines_g.selectAll("line")
      .data(v_lines)
      .enter()
      .append("line")
      .attr("x1", function(d){
        return xScale(d);})
      .attr("y1", "0")
      .attr("x2", function(d){
        return xScale(d);})
      .attr("y2", "" + h)
      .attr("stroke", "red")
      .attr("stroke-width", "2");

      h_line = [p_threshold]
      var h_lines = h_lines_g.selectAll("line")
      .data(h_line)
      .enter()
      .append("line")
      .attr("x1", "0")
      .attr("y1", function(d){
        return yScale(d);})
      .attr("x2", "" + w)
      .attr("y2",function(d){ return yScale(d);})
      .attr("stroke", "red")
      .attr("stroke-width", "2");

    });
  };

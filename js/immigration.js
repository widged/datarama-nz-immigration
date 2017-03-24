var regionOccupationCounts = {};

// Loads occupation and region information from the supplied CSV
d3.csv("data/work_visas_cut.csv", function(d) {
  return {
    occupation: d["Standard Submajor Group"],
    region: d["Region"]
  };
  // this function iterates over every entry from the work visa CSV file
}, function(data) {
  data.forEach(function(entry) {
    // If the region is not yet defined, define it
    if(regionOccupationCounts[entry.region] === undefined) {
      regionOccupationCounts[entry.region] = {};
    }

    // If this occupation is not yet defined in the region, set its count equal to one
    if(regionOccupationCounts[entry.region][entry.occupation] === undefined) {
      regionOccupationCounts[entry.region][entry.occupation] = 1;
    }
    else {
      regionOccupationCounts[entry.region][entry.occupation] += 1;
    }
  });
  // Log the regional occupational data to the console
  // console.log(JSON.stringify(regionOccupationCounts));
});


function drawChart(rootNode, region) {
  rootNode = rootNode.querySelector('#region-tree');
  // var rootNode = document.getElementById("demo");
  var width = 550, height = 470;

  var acc = [];
  for (var k in regionOccupationCounts[region]) {
    var d = regionOccupationCounts[region][k];
    acc.push({"name": k, "size": d});
  }
  var treemapData = {"name": "graph", "children": [{"name": "A", "children": acc}]};

  var svg = d3.select(rootNode).append('svg').attr("width", width).attr("height", height),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
      color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
      format = d3.format(",d");

  var treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .round(true)
      .paddingInner(1);

    data = treemapData;

    var root = d3.hierarchy(data)
        .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
        .sum(sumBySize)
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treemap(root);

    var cell = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    cell.append("rect")
        .attr("id", function(d) { return d.data.id; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) { return  "#DDFFDD" /* color(d.parent.data.id)*/; });

    cell.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.data.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.data.id; });

    cell.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
      .selectAll("tspan")
        .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
      .enter().append("tspan")
        .attr("x", 4)
        .attr("y", function(d, i) { return 13 + i * 10; })
        .text(function(d) { return d; });

    cell.append("title")
        .text(function(d) { return d.data.id + "\n" + format(d.value); });



  function sumBySize(d) {
    return d.size;
  }

}

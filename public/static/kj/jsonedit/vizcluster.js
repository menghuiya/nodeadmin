function vizcluster(json) {
    
    var tree = {};
    treeify(json, 'JSON', tree);
    $('#vizpanel').empty();

    var w = 900;
    var h = 900;
    var rx = w / 2;
    var ry = h / 2;

    var cluster = d3.layout.cluster()
        .size([360, ry - 120])
        .sort(null);

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = d3.select('#vizpanel').append('div')
        .style('width', w + 'px')
        .style('height', w + 'px');

    var vis = svg.append("svg:svg")
        .attr("width", w)
        .attr("height", w)
        .append("svg:g")
        .attr("transform", "translate(" + rx + "," + ry + ")");

    vis.append("svg:path")
        .attr("class", "arc")
        .attr("d", d3.svg.arc().innerRadius(ry - 120).outerRadius(ry).startAngle(0).endAngle(2 * Math.PI));
    
    var nodes = cluster.nodes(tree);

    var link = vis.selectAll("path.link")
        .data(cluster.links(nodes))
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = vis.selectAll("g.node")
        .data(nodes)
        .enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

    node.append("svg:circle")
        .attr("r", 3);

    node.append("svg:text")
        .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
        .text(function(d) { return d.name; });

    // Apply fisheye distortion on mousemove.

    /*
    var fisheye = d3.fisheye.circular()
        .radius(200)
        .distortion(2);

    svg.on("mousemove", function() {
        fisheye.focus(d3.mouse(this));

        console.log('mousemoving', node, link);

        node.each(function(d) { d.fisheye = fisheye(d); })
            .attr('class', function(d) { return d.fisheye.z > 1 ? 'node magnified' : 'node'; });

        link.attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return d.target.fisheye.x; })
            .attr("y2", function(d) { return d.target.fisheye.y; });
    });
    */

}

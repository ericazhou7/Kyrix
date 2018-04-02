const index = require("./src/index");
const Project = index.Project;
const Canvas = index.Canvas;
const Layer = index.Layer;
const Jump = index.Jump;
const Transform = index.Transform;
const d3 = require("d3");


// construct a project
var p = new Project("demo", "dbconfig.txt", 1000, 1000);



// ================== Canvas 1 ===================
var c1 = new Canvas("fullname", 5000, 5000);
p.addCanvas(c1);

// ******** Define Data transforms for Canvas 1 ********
// scale x and y from the pi table
var c1ScalexyPi = new Transform("scalexy_pi",
    "select * from pi;",
    "wenbo",
    function (row) {
        var ret = row.slice();
        ret[3] = d3.scaleLinear().domain([0, 5000000]).range([0, 5000])(ret[3]);
        ret[4] = d3.scaleLinear().domain([0, 5000000]).range([0, 5000])(ret[4]);
        return ret;
    },
    true
);
c1.addTransform(c1ScalexyPi);

// scale x and y from the stu table;
var c1ScalexyStu = new Transform("scalexy_stu",
    "select * from stu;",
    "wenbo",
    function (row) {
        var ret = row.slice();
        ret[3] = d3.scaleLinear().domain([0, 5000000]).range([0, 5000])(ret[3]);
        ret[4] = d3.scaleLinear().domain([0, 5000000]).range([0, 5000])(ret[4]);
        return ret;
    },
    true
);
c1.addTransform(c1ScalexyStu);

// empty transform
var c1Empty = new Transform("empty",
    "",
    "",
    function (row) {}, true);
c1.addTransform(c1Empty);


// ******** Circle Layer (pi table) ********
var c1L1 = new Layer("scalexy_pi");
c1.addLayer(c1L1);

// placement object
var c1L1Placement = {};
c1L1Placement.centroid_x = function (row) {
    return row[3];
};
c1L1Placement.centroid_y = function (row) {
    return row[4];
};
c1L1Placement.width = function (row) {return 161; };
c1L1Placement.height = function (row) {return 161; };
c1L1.addPlacement(c1L1Placement);

// rendering function
var c1L1Rendering = function render(svg, data) {
    g = svg.append("g");
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return d[3];})
        .attr("cy", function(d) {return d[4];})
        .attr("r", 80)
        .style("fill", "orange")
        .attr("data-tuple", function(d) {return d;});
    g.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d[1] + " " + d[2];})
        .attr("x", function(d) {return d[3];})
        .attr("y", function(d) {return d[4];})
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("fill-opacity", 1)
        .attr("data-tuple", function(d) {return d;});
};
c1L1.addRenderingFunc(c1L1Rendering);



// ******** Rectangle Layer (stu table) ********
var c1L2 = new Layer("scalexy_stu");
c1.addLayer(c1L2);

// placement object, same as the circle layer
c1L2.addPlacement(c1L1Placement);

// rendering function
var c1L2Rendering = function render(svg, data) {
    g = svg.append("g");
    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {return d[3] - 80;})
        .attr("y", function(d) {return d[4] - 80;})
        .attr("width", 160)
        .attr("height", 160)
        .style("fill", "pink")
        .attr("data-tuple", function(d) {return d;});
    g.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d[1] + " " + d[2];})
        .attr("x", function(d) {return d[3];})
        .attr("y", function(d) {return d[4];})
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("fill-opacity", 1)
        .attr("data-tuple", function(d) {return d;});
};
c1L2.addRenderingFunc(c1L2Rendering);


// ******** Background layer (no table) ********
var c1L3 = new Layer("empty");
c1.addLayer(c1L3);

// dummy placement object
c1L3Placement = {};
c1L3Placement.centroid_x = function (row) {};
c1L3Placement.centroid_y = function (row) {};
c1L3Placement.width = function (row) {};
c1L3Placement.height = function (row) {};
c1L3.addPlacement(c1L3Placement);

// rendering function, an empty g with a background color fill
var c1L3Rendering = function render(svg, data) {
    g = svg.append("g")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 5000)
        .attr("height", 5000)
        .style("fill", "beige");
};
c1L3.addRenderingFunc(c1L3Rendering);




// ================== Canvas 2 ===================
var c2 = new Canvas("firstname", 1000, 1000);
p.addCanvas(c2);


// ******** Define Data transform for Canvas 2 ********
var c2IDTransform = new Transform("identical",
    "select * from pi;",
    "wenbo",
    function (row) {
        return row;
    },
    true
);
c2.addTransform(c2IDTransform);

// ******** Canvas2 only layer ********
var c2L1 = new Layer("identical");
c2.addLayer(c2L1);

// constant placement object
c2L1Placement = {};
c2L1Placement.centroid_x = function (row) {return 500; };
c2L1Placement.centroid_y = function (row) {return 500; };
c2L1Placement.width = function (row) {return 200; };
c2L1Placement.height = function (row) {return 200; };
c2L1.addPlacement(c2L1Placement);

c2L1Rendering = function render(svg, data) {
    g = svg.append("g");
    g.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d[1];})
        .attr("x", 500)
        .attr("y", 500)
        .attr("dy", ".35em")
        .attr("font-size", 50)
        .attr("text-anchor", "middle")
        .style("fill-opacity", 1)
        .attr("data-tuple", function(d) {return d;});
};
c2L1.addRenderingFunc(c2L1Rendering);




// ================== Canvas 3 ===================
var c3 = new Canvas("lastname", 1000, 1000);
p.addCanvas(c3);

// data transform for canvas 3, same as the one for canvas 2
c3.addTransform(c2IDTransform);

// ******** canvas3 only layer ********
var c3L1 = new Layer("identical");
c3.addLayer(c3L1);

// same placement as canvas 2 layer
c3L1.addPlacement(c2L1Placement);

// rendering function is different, as it renders last name
c3L1Rendering = function render(svg, data) {
    g = svg.append("g");
    g.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d[2];})
        .attr("x", 500)
        .attr("y", 500)
        .attr("dy", ".35em")
        .attr("font-size", 50)
        .attr("text-anchor", "middle")
        .style("fill-opacity", 1)
        .attr("data-tuple", function(d) {return d;});
};
c3L1.addRenderingFunc(c3L1Rendering);

p.initialCanvas("fullname", 500, 500, ["", "", ""]);



// ================== fullname --> firstname, lastname ===================
var newViewport = function (row) {
    return [1, ["id=" + row[0]]];
};

p.addJump(new Jump("fullname", "firstname", newViewport));
p.addJump(new Jump("fullname", "lastname", newViewport));

p.saveToDb();

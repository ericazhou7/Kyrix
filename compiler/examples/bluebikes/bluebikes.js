// libraries
const Project = require("../../src/index").Project;
const Canvas = require("../../src/Canvas").Canvas;
const Jump = require("../../src/Jump").Jump;
const Layer = require("../../src/Layer").Layer;
const View = require("../../src/View").View;
const Table = require("../../src/template-api/Table").Table;

// project components
const renderers = require("./renderers");
const transforms = require("./transforms");
const placements = require("./placements");

// construct a project
var p = new Project("bluebikes", "../../../config.txt");
p.addRenderingParams(renderers.renderingParams);

// ================== Overall Map Canvas ===================
var width = 1200, height = 1000;
var overallMapCanvas = new Canvas("overall_map", width, height);
p.addCanvas(overallMapCanvas);

// stations
var stationsLayer = new Layer(transforms.stationsTransform, false);
overallMapCanvas.addLayer(stationsLayer);
stationsLayer.addPlacement(placements.stationsPlacement);
stationsLayer.addRenderingFunc(renderers.stationsRendering);

// map layer
var overallMapLayer = new Layer(transforms.overallMapTransform, false);
overallMapCanvas.addLayer(overallMapLayer);
overallMapLayer.addPlacement(placements.mapPlacement);
overallMapLayer.addRenderingFunc(renderers.overallMapRendering);

//title layer
var titleLayer = new Layer(null, true);
overallMapCanvas.addLayer(titleLayer);
titleLayer.addRenderingFunc(renderers.titleRendering);

// ================== Inset Map Canvas ===================
var zoomFactor = renderers.renderingParams.insetMapScale / renderers.renderingParams.overallMapScale;
var insetMapCanvas = new Canvas("inset_map", parseInt(width*zoomFactor), parseInt(height*zoomFactor));
p.addCanvas(insetMapCanvas);

//station name layer
var stationNameLayer = new Layer(transforms.selectStationTransform, true);
insetMapCanvas.addLayer(stationNameLayer);
stationNameLayer.addRenderingFunc(renderers.stationNameRendering);

// rides in layer
var ridesInLayer = new Layer(transforms.countsTransform, false);
insetMapCanvas.addLayer(ridesInLayer);
ridesInLayer.addPlacement(placements.ridesPlacement);
ridesInLayer.addRenderingFunc(renderers.ridesInRendering);
ridesInLayer.addTooltip(["end_station_name"], ["Rides to"]);

// rides out layer
var ridesOutLayer = new Layer(transforms.countsTransform, false);
insetMapCanvas.addLayer(ridesOutLayer);
ridesOutLayer.addPlacement(placements.ridesPlacement);
ridesOutLayer.addRenderingFunc(renderers.ridesOutRendering);
ridesInLayer.addTooltip(["start_station_name"], ["Rides from"]);

// map layer
var insetMapLayer = new Layer(transforms.insetMapTransform, false);
insetMapCanvas.addLayer(insetMapLayer);
insetMapLayer.addPlacement(placements.mapPlacement);
insetMapLayer.addRenderingFunc(renderers.insetMapRendering);

// ================== Rider Data Canvas ===================
/*
var riderDataCanvas = new Canvas("rider_data", width, height);
p.addCanvas(riderDataCanvas);

// rider data
var ridersLayer = new Layer(transforms.riderTransform, false);
riderDataCanvas.addLayer(ridersLayer);
ridersLayer.addPlacement(placements.tablePlacement);
ridersLayer.addRenderingFunc(renderers.riderDataRendering);
*/

// ================== Table Canvas ===================
var tableView = new View("table", 0, 0, width, height);
var fields = [
    "tripduration",
    "birth_year",
    "gender",
    "start_station_name",
    "end_station_name"
];

var table_args = {
    table: "rides",
    fields: fields,
    db: "bluebikes",
    width: {
        "tripduration": 125,
        "start_station_name": 450,
        "end_station_name": 450,
        "birth_year": 75,
        "gender": 75
    },
    heads: {
        names: {
            "tripduration": "trip_duration (s)",
            "start_station_name": "start",
            "end_station_name": "end"
        }
    },
};

var ridersTable = new Table(table_args);
var ridersObj = p.addTable(ridersTable, {view: tableView});

// ================== Views ===================
var view = new View("bluebikes", 0, 0, width, height);
p.addView(view);
p.setInitialStates(view, overallMapCanvas, 0, 0);

// ================== overall_map -> inset_map ===================
var selector = function(row, args) {
    return args.layerId == 0;
};

var newViewport = function(row, args) {
    var zoomFactor = args.renderingParams.insetMapScale/args.renderingParams.overallMapScale;
    var vpW = args.viewportW;
    var vpH = args.viewportH;
    return {
        constant: [
            parseInt(row.bbox_x * zoomFactor) - vpW / 2,
            parseInt(row.bbox_y * zoomFactor) - vpH / 2
        ]
    };
};

var newPredicate = function(row) {
    var pred0 = {"==": ["station", row.name]};
    var pred1 = {"==": ["end_station_name", row.name]};
    var pred2 = {"==": ["start_station_name", row.name]};
    return {layer0: pred0, layer1: pred1, layer2: pred2};
};

var jumpName = function(row) {
    return "Rides to & from " + row.name;
};

p.addJump(
    new Jump(overallMapCanvas, insetMapCanvas, "geometric_semantic_zoom", {
        selector: selector,
        viewport: newViewport,
        predicates: newPredicate,
        name: jumpName
    })
);

// ================== inset_map -> table ===================
var selector = function(row, args) {
    return args.layerId == 1 || args.layerId == 2;
};

var newViewport = function(row, args) {
    return {constant: [0, 0]};
};

var newPredicate = function(row) {
    var pred1 = {
        OR: [
            {
                AND: [
                {"==": ["end_station_name", row.end_station_name]},
                {"==": ["start_station_name", row.start_station_name]}
                ]
            },
            {
                AND: [
                {"==": ["end_station_name", row.start_station_name]},
                {"==": ["start_station_name", row.end_station_name]}]
            },
        ]
    };
    return {layer0: pred1};
};

var jumpName = function(row) {
    return "Rides between " + row.start_station_name + " & " + row.end_station_name;
};

p.addJump(
    new Jump(insetMapCanvas, ridersObj.canvas, "semantic_zoom", {
        selector: selector,
        viewport: newViewport,
        predicates: newPredicate,
        name: jumpName
    })
);

// save to db
p.saveProject();
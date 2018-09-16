// libraries
const index = require("../../src/index");
const Project = index.Project;
const Canvas = index.Canvas;
const Layer = index.Layer;
const Jump = index.Jump;

// project components
const renderers = require("./renderers");
const transforms = require("./transforms");
const placements = require("./placements");

// construct a project
var layerHeight = 100;
var p = new Project("eeg", "../../../config.txt", 1300, 21 * layerHeight);
p.addRenderingParams({});

// ================== Canvas sampled ===================
var width = 200000;
var height = 21 * layerHeight;
var sampledCanvas = new Canvas("sampledCanvas", width, height);
p.addCanvas(sampledCanvas);

// add data transforms
sampledCanvas.addTransform(transforms.mainTransform);
sampledCanvas.addTransform(transforms.yaxisTransform);

// channel layer
var channelLayer = new Layer("sampleddata", false);
sampledCanvas.addLayer(channelLayer);
channelLayer.addRenderingFunc(renderers.mainRendering);
channelLayer.addPlacement(placements.eegPlacement);

// y axis layer
var yaxisLayer = new Layer("yaxis", true);
sampledCanvas.addLayer(yaxisLayer);
yaxisLayer.addRenderingFunc(renderers.yaxisRendering);

// x axis layer render
sampledCanvas.addAxes(renderers.xAxes);

// ================== Canvas original data ===================

var realw = width * 3;
var realh = 21 * layerHeight;
var realCanvas = new Canvas("realCanvas", realw, realh);
p.addCanvas(realCanvas);

realCanvas.addTransform(transforms.realTransform);
realCanvas.addTransform(transforms.yaxisTransform);

// x axis layer render
realCanvas.addAxes(renderers.xAxes);

// y axis layer
var realYaxisLayer = new Layer("yaxis", true);
realCanvas.addLayer(realYaxisLayer);
realYaxisLayer.addRenderingFunc(renderers.yaxisRendering);

var realLayer = new Layer("realdata", false);
realCanvas.addLayer(realLayer);
realLayer.addRenderingFunc(renderers.mainRendering);
realLayer.addPlacement(placements.eegPlacement);



p.addJump(new Jump("sampledCanvas", "realCanvas", 0, "", "", "literal_zoom_in"));
p.addJump(new Jump("realCanvas", "sampledCanvas", 0, "", "", "literal_zoom_out"));

// initialize canvas
p.initialCanvas("sampledCanvas", 17300*4, 0, ["",""]);

// save to db
p.saveProject();

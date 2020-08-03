var mapPlacement = {
    centroid_x: "col:bbox_x",
    centroid_y: "col:bbox_y",
    width: "con:300",
    height: "con:300"
};

var stationsPlacement = {
    centroid_x: "col:bbox_x",
    centroid_y: "col:bbox_y",
    width: "con:500",
    height: "con:500"
};
/**
var ridesPlacement = {
    centroid_x: "col:start_bbox_x",
    centroid_y: "col:start_bbox_y",
    width: "con:700",
    height: "con:700"
};**/

var ridesPlacement = {
    centroid_x: "col:start_bbox_x",
    centroid_y: "col:start_bbox_y",
    width: "con:700",
    height: "con:10000000"
};

module.exports = {
	mapPlacement,
	stationsPlacement,
    ridesPlacement
};

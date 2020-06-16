const Transform = require("../../src/Transform").Transform;

var mghTransform = new Transform(
    "SELECT * FROM geoms WHERE kind IN ('Room', 'Level');", 
    "mgh",
    "",
    [],
    true
);

var fakeTransform = new Transform(
    "SELECT * FROM fakerooms;", 
    "mgh",
    "",
    [],
    true
);


module.exports = {
    mghTransform,
    fakeTransform
};

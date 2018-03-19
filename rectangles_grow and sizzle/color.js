// A library for colors
// Set the colors in the colorArray, using a color wheel program (like Adobe Kule)
var colorArray = [
    '#4B2485',
    '#277C8F',
    '#317827',
    '#8F7927',
    '#852D15',
    '#3FC42C',
    '#3F3885',
    '#317827',
    '#45240F',
    '#C46D36'
];

function randomColor(colors) {
    var i = randIntBetween(0, colors.length - 1);
    return colors[i];
}

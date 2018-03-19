// A library for colors
// Set the colors in the colorArray, using a color wheel program (like Adobe Kule)
var colorArray = [
    '#FF3924',
    '#BF2B1B',
    '#7F1D12',
    '#400E09'
];

function randomColor(colors) {
    var i = randIntBetween(0, colors.length - 1);
    return colors[i];
}

// This program will create a set of rectangles that grow randomly.

// Global variables
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var mouse = {
    x: undefined,
    y: undefined
}
var sparks = new Sparks();
var sparkSizeFactor = 1;
var palettes;

var rectArray = [];

// Event listeners
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
//    console.log('mouse at %s, %s',mouse.x, mouse.y);
});

window.addEventListener('mousedown', function(event) {
    // if left mouse button pushed
    if (event.button == 0) {
            // bigger sparks
        sparks.bigger(5);
        sparks.setDrawFunction(drawHotdog);
    }
});

window.addEventListener('keydown', function(event) {
    sparks.explode();
    sparks.setDrawFunction();
});

window.addEventListener('mouseup', function(event) {
    // if left mouse button released
    if (event.button == 0) {
            // Return sparks to normal size
        sparks.bigger(1);
    }
});

window.addEventListener('resize', function() {
    init();
});


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    for (var i=0; i<rectArray.length; i++) {
        var rectangle = rectArray[i];
        rectangle.grow();
        rectangle.draw();
    }
    // Create some new sparks at the mouse pointer
    sparks.newSparks({posx: mouse.x, posy: mouse.y});
    // Now display all the sparks
    sparks.update();

    c.font = "60px Arial";
    c.fillStyle = "#A9A9A9";
    var canText = "Random Rectangles with Sparkling Pointer!";
    var widthOffset = c.measureText(canText).width / 2;
    c.fillText("Random Rectangles with Sparkling Pointer!",canvas.width/2-widthOffset, canvas.height/2 - 30);
}

// Initialization function
function init () {
    rectArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var rectsPalette = {name: "rectsPalette", colors: ["#FFE71B", "#E87E0C", "#FF0000", "#8B0CE8", "#0D68FF"]};
    palettes = new ColorPalettes();
    palettes.createPalette(rectsPalette.name, rectsPalette.colors);

    var numRects = 20;
    var rectWidth = Math.floor(canvas.width/numRects);
    for (var i=0; i<numRects; i++) {
        var color = palettes.randomColor("rectsPalette");
        if (i > 0) while (color == rectArray[i-1].color) {
            color = palettes.randomColor("rectsPalette");
        }
        rectArray.push(new Rectangle(rectWidth*i, canvas.height, randIntBetween(100, 400), rectWidth, color));
    }    
}

init();

animate();


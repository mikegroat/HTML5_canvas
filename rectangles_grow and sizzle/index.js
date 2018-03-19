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
    sparks.newSparks({posx: mouse.x, posy: mouse.y, colors: colorArray});
    // Now display all the sparks
    sparks.update();

    c.font = "60px Arial";
    c.fillStyle = "#A9A9A9";
    c.fillText("Random Rectangles with Sparkling Pointer!",canvas.width/2-630, canvas.height/2 - 30);
}

// Initialization function
function init () {
    rectArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var numRects = 20;
    var rectWidth = Math.floor(canvas.width/numRects);
    for (var i=0; i<numRects; i++) {
        rectArray.push(new Rectangle(rectWidth*i, canvas.height, randIntBetween(100, 400), rectWidth, randomColor(colorArray)));
    }    
}


function randIntBetween(min, max) {
    var range = max - min;
    return Math.floor(Math.random() * range) + min;
}

init();

animate();


// This program will create a sizzle at the mouse pointer, and then make the sizzle stronger while the mouse button is clicked.

// Global variables
var sparks = new Sparks();
var sparkSizeFactor = 1;
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var hotdog;
var mouse = {
    x: undefined,
    y: undefined
}
var maxVelocity = 6;

var maxRadius = 4;

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

// draw the hotdog
function drawHotdog() {
    c.drawImage(hotdog, this.x, this.y);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    c.font = "60px Arial";
    c.fillText("Sparkle Cursor!",canvas.width/2-420, canvas.height/2 - 30);
    // Create some new sparks near the mouse position
    sparks.newSparks({posx: mouse.x, posy: mouse.y, colors: colorArray});
    // Now display all the sparks
    sparks.update();
}

// Initialization function
function init () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hotdog = document.getElementById("hotdog");
    
}


function randIntBetween(min, max) {
    var range = max - min;
    return Math.floor(Math.random() * range) + min;
}

init();

animate();


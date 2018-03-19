// This program will create a sizzle at the mouse pointer, and then make the sizzle stronger while the mouse button is clicked.

// Global variables
var sparkArray = [];
var sparkSizeFactor = 1;
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
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
    sparkSizeFactor = 5;
    } else {
        // explode the parks
        for (var i=0; i<sparkArray.length; i++) {
            sparkArray[i].speed = sparkArray[i].speed.multiply(20);
            sparkArray[i].radius *= 10;
        }    
    }
});

window.addEventListener('mouseup', function(event) {
    // if left mouse button released
    if (event.button == 0) {
    // Return sparks to normal size
    sparkSizeFactor = 1;
    }
});

window.addEventListener('resize', function() {
    init();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    // Create some new sparks near the mouse position
    var numSparks = randIntBetween(1,4);
    for (var i=0; i<numSparks; i++) {
        var x = mouse.x + randIntBetween(- 4, 4);
        var y = mouse.y + randIntBetween(- 4, 4);
        var dx = randIntBetween(-4 , 4);
        var dy = randIntBetween(-4 , 4);
        var r = randIntBetween(1, 20) * sparkSizeFactor;
        var colors = colorArray;
        var color = randomColor(colorArray);
        var spark = new Particle(x, y, dx, dy, r, color);
        spark.colors = colors;
        spark.curColor = -1;
        sparkArray.push(spark);    
    }

    // Now display all the sparks
    for (var i=sparkArray.length-1; i>=0; i--) {
        var spark = sparkArray[i];
        spark.radius--;
        if (spark.radius < 1) {
            sparkArray.splice(i,1);
        } else {
            spark.update();
            spark.draw();
        }
    }
}

// Initialization function
function init () {
    sparkArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
}


function randIntBetween(min, max) {
    var range = max - min;
    return Math.floor(Math.random() * range) + min;
}

init();

animate();


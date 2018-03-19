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
    console.log('mouse at %s, %s',mouse.x, mouse.y);
});

window.addEventListener('mousedown', function() {
    // Make sizzle stronger
    sparkSizeFactor = 5;
    for (var i=0; i<sparkArray.length; i++) {
        sparkArray[i].speed = sparkArray[i].speed.multiply(100);
    }
});

window.addEventListener('mouseup', function() {
    // Return sizzle to normal
    sparkSizeFactor = 1;
});

window.addEventListener('resize', function() {
    init();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    // Create some new sparks near the mouse position
    var numSparks = randIntBetweenLimits(1,4);
    for (var i=0; i<numSparks; i++) {
        var x = mouse.x + randIntBetweenLimits(- 4, 4);
        var y = mouse.y + randIntBetweenLimits(- 4, 4);
        var dx = Math.floor(Math.random()*9)-4;
        var dy = Math.floor(Math.random()*9)-4;
        var r = randIntBetweenLimits(1, 20) * sparkSizeFactor;
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


function randIntBetweenLimits(min, max) {
    return Math.floor(Math.random() * (max+1)) + min;
}

init();

animate();


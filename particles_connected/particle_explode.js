// A fun program where I'm playing with canvas objects in javascript
// Generates a bunch of particles in random 2d space, with random x and y velocities, 
// connects some of them with lines, and animtes the whole thing
var colorArray = [
    '#C3D4FF',
    '#9988CC',
    '#503899',
    '#FFCF83',
    '#CCA888'
];

var maxRadius = 40;
var particleArray = [];
var lineArray = [];
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mousedown', function() {
    for (var i=0; i<particleArray.length; i++) {
        particleArray[i].attractorOn();
    }
});

window.addEventListener('mouseup', function() {
    for (var i=0; i<particleArray.length; i++) {
        particleArray[i].attractorOff();
    }
});

window.addEventListener('resize', function() {
    init();
});

function Particle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.draw = function() {
        c. beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();    
    }

    this.update = function() {
        this.onEdge();
        this.x += this.dx;
        this.y += this.dy;
        
        this.draw();
    }

    this.onEdge = function() {
        var result = false;
        if (this.x >= window.innerWidth - this.radius || this.x <= this.radius) {
            this.dx = -this.dx;
            result = true;
        }
        if (this.y >= window.innerHeight - this.radius || this.y <= this.radius) {
            this.dy = -this.dy;
            result = true;
        }
        return result;
    }

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    for (var i=0; i<particleArray.length; i++) {
        particleArray[i].update();
    }
    drawLines();
}

function init () {
    particleArray = [];
    lineArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    var maxParticles = 20;
    for (var i=0; i<maxParticles; i++) {
        var radius = randIntBetweenLimits(maxRadius/2, maxRadius);
        var x = randIntBetweenLimits(radius, window.innerWidth - 2 * radius);
        var y = randIntBetweenLimits(radius, window.innerHeight - 2 * radius);
        var dx = (Math.random() -0.5) * 4;
        var dy = (Math.random() - 0.5) * 4;
        var color = colorArray[randIntBetweenLimits(0, colorArray.length-1)];
        var particle = new Particle(x, y, dx, dy, radius, color);
        particleArray.push(particle);
    }
    
    // Comnnect some particles with lines
    // Starting with twice
    var maxLines = particleArray.length*2;
    for (var i=0; i<maxLines; i++) {
        var partA = randIntBetweenLimits(0, particleArray.length-1);
        var partB;
        do {
            partB = randIntBetweenLimits(0, particleArray.length-1);
        } 
        while (partB == partA);
        var line = { A: particleArray[partA], B: particleArray[partB] };
        lineArray.push(line);
    }
}

function withinRange(x, y) {
    return mouse.x - x < 50 && mouse.x - x > -50 && mouse.y - y < 50 && mouse.y - y > -50;
}

function drawLines() {
    for (var i=0; i<lineArray.length; i++) {
        c.beginPath();
        var startX = lineArray[i].A.x;
        var startY = lineArray[i].A.y;
        var endX = lineArray[i].B.x;
        var endY = lineArray[i].B.y;
        c. moveTo(startX, startY);
        c.setLineDash([5, 5])
        c.lineTo(endX, endY);
        c.stroke();
    }
}

function randIntBetweenLimits(min, max) {
    return Math.floor(Math.random() * (max+1)) + min;
}

init();

animate();


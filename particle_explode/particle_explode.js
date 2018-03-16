// My first program playing with canvas objects in javascript
// Generates a bunch of particles in random 2d space, with random x and y velocities, and animtes them
// If a particle comes close (within about 50 pixels) of the mouse pointer, it'll expand
// Once it moves out of that proximity, it'll shrink to it's originial size.
// If you click the mouse button, it will begin attracting the particles to the cursor until you release the mouse button.
var colorArray = [
    '#FCFFF5',
    '#D1DBBD',
    '#91AA9D',
    '#3E606F',
    '#193441'
];

var maxRadius = 40;
var maxRadius2 = maxRadius;
var particleArray = [];
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
    this.minRadius = radius;
    this.color = color;
    this.attractor = false;

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
        if (this.attractor) {
            if (withinRange(this.x, this.y)) {
                this.x -= (mouse.x - this.x) * 0.005;
                this.y -= (mouse.y - this.y) * 0.005;
            } else {
                this.x += (mouse.x - this.x) * 0.005;
                this.y += (mouse.y - this.y) * 0.005;    
            }
        }
        
        // interactivity
        if (withinRange(this.x, this.y)) {
            if (this.radius < maxRadius) {
                this.radius += 1;
            }
        }  else if (this.radius > this.minRadius) {
            this.radius -= 1;
        }    
        this.draw();
    }

    this.attractorOn = function() {
        this.attractor = true;
    }

    this.attractorOff = function() {
        this.attractor = false;
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
    if (maxRadius > maxRadius2) {
        maxRadius--;
    }
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    for (var i=0; i<particleArray.length; i++) {
        particleArray[i].update();
    }
}

function init () {
    particleArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var max = Math.floor(window.innerWidth * window.innerHeight / 1200);
    for (var i=0; i<max; i++) {
        var radius = Math.random() * 2 + 1;
        var x = Math.random() * (window.innerWidth - 2 * radius) + radius;
        var y = Math.random() * (window.innerHeight - 2 * radius) + radius;
        var dx = (Math.random() -0.5) * 4;
        var dy = (Math.random() - 0.5) * 4;
        var color = colorArray[Math.floor(Math.random() * 4 + 1)];
        var particle = new Particle(x, y, dx, dy, radius, color);
        particleArray.push(particle);
    }
    
    for (var i=0; i<particleArray.length; i++) {
        particleArray[i].draw();
    }
}

function withinRange(x, y) {
    return mouse.x - x < 50 && mouse.x - x > -50 && mouse.y - y < 50 && mouse.y - y > -50;
}

init();

animate();


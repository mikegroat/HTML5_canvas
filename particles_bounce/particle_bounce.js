// A fun program where I'm playing with canvas objects in javascript to build some collision capabilities
// Generates a bunch of particles in random 2d space, with random x and y velocities, 
// connects some of them with lines, and animtes the whole thing
var colorArray = [
    '#C3D4FF',
    '#9988CC',
    '#503899',
    '#FFCF83',
    '#CCA888'
];

function randomColor() {
    var i = randIntBetweenLimits(0, colorArray.length - 1);
    return colorArray[i];
}

var maxVelocity = Math.sqrt(4 * 4 + 4 * 4);

var maxRadius = 40;
var particleArray = [];
var lineArray = [];
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var mouse = {
    x: undefined,
    y: undefined
}
var nullParticle = {id: 0};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// window.addEventListener('mousedown', function() {
//     for (var i=0; i<particleArray.length; i++) {
//         particleArray[i].attractorOn();
//     }
// });

// window.addEventListener('mouseup', function() {
//     for (var i=0; i<particleArray.length; i++) {
//         particleArray[i].attractorOff();
//     }
// });

window.addEventListener('resize', function() {
    init();
});

function Particle(x = 0, y= 0, dx = 0, dy = 0, radius = 1, color = randomColor()) {
    this.position = new Vector(x, y);
    this.id = randIntBetweenLimits(1, 100000000);
    this.speed = new Vector(dx, dy);
    this.radius = radius;
    this.mass = radius;
    this.color = color;
    this.collidedParticle = undefined;

    this.draw = function() {
        c. beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();    
        this.drawSpeedVector();
    }

    this.update = function() {
        this.isOnEdge();
        this.position = this.position.add(this.speed);
    }

    // When fromParticle is false call is coming from outside the particles, so have to call the other particle we're colliding with
    this.collidedWith = function(particle) {
        this.collidedParticle = particle.copy();
    }

    this.processCollision = function() {

        // FIXME: this currently allows particles to get entangled - likely when two particles collide near a border
        // start by bouncing off a wall if necesary so velocity will be pointing in the right direction
        this.isOnEdge();

        // excerpt from http://www.gamasutra.com/view/feature/3015/pool_hall_lessons_fast_accurate_.php?page=3
        var p1 = this.position;
        var v1 = this.speed;
        var p2 = this.collidedParticle.position;
        var v2 = this.collidedParticle.speed;
        var m1 = this.mass;
        var m2 = this.collidedParticle.mass;

        // First, find the normalized vector n from the center of this particle to the center of the collided particle.
        var Un = p1.subtract(p2).normalize();
        // Now, find the unit tangent vector
        var Ut = new Vector(-Un.y, Un.x);

        // Project the velocity vectors onto the unit normal and unit tangent vectors.
        var v1n = Un.dot(v1);
        var v1t = Ut.dot(v1);
        var v2n = Un.dot(v2);
        var v2t = Ut.dot(v2);

        // Find the new tangential velocities (after the collision).
        var v1t_prime = v1t;
        var v2t_prime = v2t;

        // Find the new normal velocities (edited to remove mass from the equation)
        // var v1n_prime = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        // var v2n_prime = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);
        var v1n_prime = (2 * m2 * v2n) / (2);
        var v2n_prime = (2 * m1 * v1n) / (2);

        // Convert the scalar normal and tengential velocities into vectors
        var V1n_prime = Un.multiply(v1n_prime);
        var V1t_prime = Ut.multiply(v1t_prime);

        // Find the final velcodity vector by adding the normal and tangential components
        this.speed = V1n_prime.add(V1t_prime);

    }

    this.drawSpeedVector = function() {
        var endPoint = this.speed.multiply(20);
        var endPoint = endPoint.add(this.position);
        c.beginPath();
        c.moveTo(this.position.x, this.position.y);
        c.lineTo(endPoint.x, endPoint.y);
        c.stroke();        
    }

    this.copy = function() {
        var x = this.position.x;
        var y = this.position.y;
        var dx = this.speed.x;
        var dy = this.speed.y;
        var radius = radius;
        var color = color;
        var returnParticle = new Particle(x, y, dx, dy, radius, color);
        returnParticle.id = this.id;
        return returnParticle;
    }

    this.amBreaking = function() {
        this.amBoundWith = nullParticle;
    }

    this.isOnEdge = function() {
        var result = false;
        if (this.position.x >= window.innerWidth - this.radius) {
            this.speed.x = -this.speed.x;
            this.position.x += this.speed.x;
            result = true;
        }
        if (this.position.x <= this.radius) {
            this.speed.x = -this.speed.x;
            this.position.x += this.speed.x;
            result = true;
        }
        if (this.position.y >= window.innerHeight - this.radius) {
            this.speed.y = -this.speed.y;
            this.position.y += this.speed.y;
            result = true;
        } 
        if (this.position.y <= this.radius) {
            this.speed.y = -this.speed.y;
            this.position.y += this.speed.y;
            result = true;
        }
    return result;
    }

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    for (var i=0; i<particleArray.length; i++) {
        var a = particleArray[i];
        for (var j=0; j<particleArray.length; j++) {
            var b = particleArray[j];
            if (i != j && collision(a.position.x, a.position.y, a.radius, b.position.x, b.position.y, b.radius)) {
                a.collidedWith(b);
                b.collidedWith(a);
                a.processCollision();
                b.processCollision();
            }
        }
        a.update();
        a.draw();
    }
}

function init () {
    particleArray = [];
    lineArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    var maxParticles = 10;
    for (var i=0; i<maxParticles; i++) {
        var radius = randIntBetweenLimits(maxRadius/2, maxRadius);
        var x = randIntBetweenLimits(radius+1, window.innerWidth - 2 * radius - 1);
        var y = randIntBetweenLimits(radius+1, window.innerHeight - 2 * radius - 1);
        while (insideAnotherParticle(x, y, radius)) {
            x = randIntBetweenLimits(radius, window.innerWidth - 2 * radius);
            y = randIntBetweenLimits(radius, window.innerHeight - 2 * radius);                
        }
        var dx = randIntBetweenLimits(-maxVelocity, maxVelocity);
        var dy = randIntBetweenLimits(-maxVelocity, maxVelocity);
        var color = colorArray[randIntBetweenLimits(0, colorArray.length-1)];
        var particle = new Particle(x, y, dx, dy, radius, color);
        particleArray.push(particle);
    }

    function insideAnotherParticle(x, y, r) {
        var res = false;
        var loc = new Vector(x,y);
        for (var i=0; i<particleArray.length; i++) {
            var dist = particleArray[i].position.distance(loc);
            if (dist <= particleArray[i].radius + r) {
                res = true;
                break;
            }
        }
        return res;
    }
    
    // Comnnect some particles with lines
    // Starting with twice
    // var maxLines = particleArray.length*2;
    // for (var i=0; i<maxLines; i++) {
    //     var partA = randIntBetweenLimits(0, particleArray.length-1);
    //     var partB;
    //     do {
    //         partB = randIntBetweenLimits(0, particleArray.length-1);
    //     } 
    //     while (partB == partA);
    //     var line = { A: particleArray[partA], B: particleArray[partB] };
    //     lineArray.push(line);
    // }
}

function collision(aX, aY, aR, bX, bY, bR) {
    var deltaX = aX - bX;
    var deltaY = aY - bY;
    var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return dist <= aR + bR;
}

function withinRange(x, y) {
    return mouse.x - x < 50 && mouse.x - x > -50 && mouse.y - y < 50 && mouse.y - y > -50;
}

// function drawLines() {
//     for (var i=0; i<lineArray.length; i++) {
//         c.beginPath();
//         var startX = lineArray[i].A.x;
//         var startY = lineArray[i].A.y;
//         var endX = lineArray[i].B.x;
//         var endY = lineArray[i].B.y;
//         c. moveTo(startX, startY);
//         c.setLineDash([5, 5])
//         c.lineTo(endX, endY);
//         c.stroke();
//     }
// }

function randIntBetweenLimits(min, max) {
    return Math.floor(Math.random() * (max+1)) + min;
}

init();

animate();


// Global variables
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var mouse = new Vector();
var palettes = new ColorPalettes();
var round = 0;
var state = "initializing";
var shotVector = new Vector();
var lastRowBottom;
var endGameColor;
var endGameColorCount = 0;
var score = 0;
var hiScore = 0;
var startTime = Date.now();
var frames = 0;
var fps = 0;
const maxTextFontSize = 30;
var textFontSize = maxTextFontSize;

// rectangle globals
var numrects;
const rectWidth = 50;
const xStart = 3;
const yStart = rectWidth * 3;
var rectArray = [];
const rectCenterOffset = new Vector(rectWidth/2, -rectWidth/2);
var emptyRectArray = [];

// ball globals
const ballSize = rectWidth/5;
const releaseDist = ballSize * 5;
const ballSpeed = 10;
const minBalls = 1;
var ballOrigin = new Vector();
var ballCount = minBalls;
var ballArray = [];
var ballsReleased = 0;

// prize globals
var prizeArray = [];
const maxPrizeSize = rectWidth * 0.375;
const minPrizeSize = maxPrizeSize / 2;
const prizeSizeIncrement = (maxPrizeSize - minPrizeSize) / 20;
var prizesCaptured = [];


// Mouse event listeners
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
//    console.log('mouse at %s, %s',mouse.x, mouse.y);
});

window.addEventListener('mousedown', function(event) {
    console.log("mousedown = %s", JSON.stringify(event));
    // do we change the state?
    if (event.button == 0 && state == "waiting") {
        state = "aiming";
    }
});

window.addEventListener('mouseup', function(event) {
    console.log("mouseup = %s", JSON.stringify(event));
    // do we change the state?
    if (event.button == 0 && state == "aiming") {
        state = "shooting";
        // Prime ball array with first ball
        var newBall = new Particle(ballOrigin.x, ballOrigin.y, shotVector.x, shotVector.y, ballSize, "#000000");
        newBall.onScreen = true;
        ballArray.push(newBall);
        ballsReleased = 1;
    }
});

// Touch event listeners
window.addEventListener('touchmove', function (event) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    console.log('touchmove to %s, %s',mouse.x, mouse.y);
});

window.addEventListener('touchstart', function(event) {
    console.log("touchstart = %s", JSON.stringify(event));
    // do we change the state?
    if (state == "waiting") {
        state = "aiming";
    } else if (state = 'end_game') {
        init();
    }
});

window.addEventListener('touchend', function(event) {
    console.log("touchend = %s", JSON.stringify(event));
    // do we change the state?
    if (state == "aiming") {
        state = "shooting";
        // Prime ball array with first ball
        var newBall = new Particle(ballOrigin.x, ballOrigin.y, shotVector.x, shotVector.y, ballSize, "#000000");
        newBall.onScreen = true;
        ballArray.push(newBall);
        ballsReleased = 1;
    }
});

document.body.addEventListener('touchstart', function (event) {
    if (event.target == canvas) {
        event.preventDefault();
    }
});

document.body.addEventListener('touchend', function (event) {
    if (event.target == canvas) {
        event.preventDefault();
    }
});

document.body.addEventListener('touchmove', function (event) {
    if (event.target == canvas) {
        event.preventDefault();
    }
});

// Other event listeners
window.addEventListener('keypress', function(event) {
    if (state == 'end_game') {
        init();
    } else {
        for (var i=0; i<ballArray.length; i++) {
            ballArray[i].speed.y = 10;
        }
    }
});


window.addEventListener('resize', function() {
    // init();
});


// Animation loop
function animate() {
//    console.log("state = %s", state);
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth, window.innerHeight);
    drawShotVector();
    animatePrizes();
    drawRects();
    releaseBalls();
    checkEndGame();
}

// Initialization function
function init () {
    rectArray = [];
    ballArray = [];
    prizeArray=[];
    prizesCaptured = [];
    score = 0;
    round = 0;
    ballCount = minBalls;


    // Set the color palettes
    palettes.createPalette("Blocks", ["#7F1C00", "#FF673C", "#FF3800", "#7F5245", "#CC2D00"]);
    palettes.createPalette("Prizes", ["#077F67", "#5BFFDE", "#0FFFCE", "#2E7F6F", "#0CCCA5"]);
    palettes.createPalette("Text", ["#11167F", "#6F75FF", "#222CFF", "#373B7F", "#1B23CC"]);

    endGameColor = palettes.getColor("Text", 0);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lastRowBottom = canvas.height - rectWidth;
    numRects = Math.floor(canvas.width/rectWidth);

    textFontSize = Math.min(Math.floor(canvas.width/100), maxTextFontSize);

    state = "new_row";

    // Set the first rectangle row
    newRectRow();

    setBallOrigin();

}

function animatePrizes() {
    for (var i=0; i<prizeArray.length; i++) {
        prizeArray[i].radius += prizeSizeIncrement;
        if (prizeArray[i].radius > maxPrizeSize) prizeArray[i].radius = minPrizeSize;
    }
}

function drawShotVector() {
    c.beginPath();
    if (state == "waiting" || state == "aiming") {
        c.arc(ballOrigin.x, ballOrigin.y, 5, 0, Math.PI * 2, false);
        c.fillStyle = "#000000";
        c.fill();        
    }
    if (state == "aiming") {
        shotVector = mouse.subtract(ballOrigin).normalize().multiply(ballSpeed);    
        c.moveTo(ballOrigin.x, ballOrigin.y);
        c.lineTo(mouse.x, mouse.y);
        c.stroke();
    }
}

function drawRects() {
    // do we need to move the rectangles?
    if (state == "move_rects") {
        // set up the rectangles to move down the screen
        for (var i=0; i<rectArray.length; i++) {
            var currRect = rectArray[i];
            var toPos = currRect.position.copy();
            toPos.y += rectWidth;
            currRect.moveTo(toPos);
        }
        // set up the prizes to move down the screen
        for (var i=0; i<prizeArray.length; i++) {
            var currPrize = prizeArray[i];
            var toPos = currPrize.position.copy();
            toPos.y += rectWidth;
            currPrize.moveTo(toPos);
        }
        state = "update_rects";
    }

    var bottomRectY = 0;

    // update/draw rectangles
    for (var i=0; i<rectArray.length; i++) {
        if (state == "update_rects") {    
            rectArray[i].update();
        }
        rectArray[i].draw();
        if (rectArray[i].position.y > bottomRectY) bottomRectY = rectArray[i].position.y;
    }

    // update/draw prizes
    for (var i=0; i<prizeArray.length; i++) {
        if (state == "update_rects") {
            prizeArray[i].update();
        }
        prizeArray[i].draw();
    }
    
    // we've moved or destroyed all the rectangles, time to make a new row
    if (state == "update_rects" && (rectArray.length == 0 || rectArray[0].moveSteps <= 0)) {
        state = "new_row";
        newRectRow();
    }

    // the rectangles have gone past the bottom of the playing area, so game is over
    if (bottomRectY >= lastRowBottom) state = "end_game";
}

function clearPrize(pType, pArray) {
    for (var i=pArray.length-1; i>=0; i--) {
        pArray[i].prize[pType] = 0;
        var deleteItem = true;
        for (var prop in pArray[i].prize) {
            deleteItem = deleteItem && pArray[i].prize[prop] <= 0;
        }
        if (deleteItem) pArray.splice(i,1);
    }
}

function prizeCount(pType, pArray) {
    var cVal = 0;
    for (var i=0; i<pArray.length; i++) {
        var currPrize = pArray[i].prize;
        cVal += currPrize[pType];
    }
    return cVal;
}

function updatePrizeCount() {
    ballCount += prizeCount("balls", prizesCaptured);
    clearPrize("balls", prizesCaptured);
}

function newRectRow() {
    if (state == "new_row") {
        // Increase the min life of a rectangle;
        round++;
        state = "waiting";
        emptyRectArray = [];

        for (var i=0; i<numRects; i++) {
            if (randTF()) {
                // create a new rectangle
                var temprect = new Rectangle(rectWidth*i+xStart, yStart, rectWidth, rectWidth, palettes.randomColor("Blocks"), "#000000", randIntBetween(round, round*2));
                rectArray.push(temprect);
                temprect.draw();
            } else {
                // blank space, save that info to use to find space to place prizes
                emptyRectArray.push(i);
            }
        }
            
        var totBallPotential = ballCount + prizeCount("balls", prizeArray);
        // create a new prize?
        while (totBallPotential < round) {
            // create a prize at one of the blank spaces
            var whichBlank = randIntBetween(0, emptyRectArray.length-1);
            var i = emptyRectArray[whichBlank];
            var tempPrize = new Particle(xStart + rectWidth*i + rectWidth/2, yStart - rectWidth/2, 0, 0, minPrizeSize, palettes.randomColor("Prizes"));
            tempPrize.prize = {balls: 1};
            prizeArray.push(tempPrize);
            tempPrize.draw();
            console.log("added prize to prize array: %s", JSON.stringify(tempPrize));
            emptyRectArray.splice(whichBlank, 1);
            totBallPotential = ballCount + prizeCount("balls", prizeArray);
        }
    }
}

function releaseBalls() {

    // check if the balls are released on each interval and, if so, update them and the rectangles they hit 
    if (state == "shooting") {
        // do we need to release another ball on this interval?
        var lastBall = ballArray[ballArray.length - 1];
        if (lastBall.position.distance(ballOrigin) >= releaseDist && ballCount > ballsReleased) {
            var newBall = new Particle(ballOrigin.x, ballOrigin.y, shotVector.x, shotVector.y, ballSize, "#000000");
            newBall.onScreen = true;
            ballArray.push(newBall);
            ballsReleased++;
        } 
        if (ballCount == ballsReleased) {
            state = "ball_update";
        }
    }
    if (state == "shooting" || state == "ball_update") {
        // update and draw all balls 
        for (var i=0; i<ballArray.length; i++) {
            var currBall = ballArray[i];
            currBall.update({left: true, right: true, top: true, bottom: false});

            // check to see if the ball has collided with any of the rectangles or prizes
            var res = hasBallCollided(currBall);
            
            // if ball has dropped off the bottom of the screen
            if (currBall.position.y - ballSize > canvas.height) {
                currBall.onScreen = false;
            } else {
                currBall.draw();
            }
        }

        var lastBallLeaving;

        // remove any balls that have gone off screen
        for (var i=ballArray.length-1; i>=0; i--) {
            if (!ballArray[i].onScreen) {
                lastBallLeaving = ballArray.splice(i, 1);
                }
        }

        // if all balls are off screen, then change state
        if (ballArray.length == 0) {
            state = "move_rects";
            ballsReleased = 0;
            setBallOrigin(lastBallLeaving[0].position.x);
            updatePrizeCount();            
        }
    }
}   

function setBallOrigin(xpos) {
    // set the ball origin at a random position on the bottom of the screen
    ballOrigin.x = randIntBetween(20, canvas.width-20); 
    if (xpos != null && xpos > 20 && xpos < canvas.width-20) ballOrigin.x = xpos;
    ballOrigin.y = canvas.height - 20;
}

function hasBallCollided(ball) {
    for (var i=rectArray.length-1; i>=0; i--) {
        var currRect = rectArray[i];

        // check if we've hit the rectangle
        var distX = Math.abs(ball.position.x - currRect.position.x-currRect.width/2);
        var distY = Math.abs(ball.position.y - currRect.position.y+currRect.height/2);
        var xfactor = Math.min((currRect.width/2)/distX, 1);
        var yfactor = Math.min((currRect.height/2)/distY, 1);
        if (distX <= (currRect.width/2 + ball.radius) &&
            distY <= (currRect.width/2 + ball.radius)) {
            // ball has hit rectangle... 
            score++;
        
            // now figure out where
            if (ball.position.x >= currRect.position.x && ball.position.x <= currRect.position.x + currRect.width ) {
                // ball is on top or underneath the rectangle
                ball.speed = new Vector(ball.speed.x, -ball.speed.y * xfactor);
            } else if (ball.position.y <= currRect.position.y && ball.position.y >= currRect.position.y - currRect.height) {
                // ball is to left or right of the rectangle
                ball.speed = new Vector(-ball.speed.x * yfactor, ball.speed.y);
            } else {
                // ball has hit the corner of the rectangle, but which corner?
                if (ball.position.x < currRect.position.x + currRect.width/2) {
                    // ball hit one of the left corners, speed.x needs to be negative
                    if (ball.speed.x > 0) yfactor = -yfactor;
                } else {
                    // ball hit one of the right corners, speed.x needs to be positive
                    if (ball.speed.x < 0) yfactor = -yfactor;
                }
                if (ball.position.y < currRect.position.y - currRect.height/2) {
                    // ball hit one of the top corners, speed.y needs to be negative
                    if (ball.speed.y > 0) xfactor = -xfactor;
                } else {
                    // ball hit one of the bottom corners, speed.y needs to be positive
                    if (ball.speed.y < 0) xfactor = -xfactor;
                }
                ball.speed = new Vector(ball.speed.x * yfactor, ball.speed.y * xfactor);
            }

            // make sure ball speed hasn't gone too high or too low
            if (ball.speed.y < 1) ball.speed = new Vector(ball.speed.x, ball.speed.y + Math.random() - 0.5);
            if (ball.speed.magnitude() < ballSpeed) ball.speed = ball.speed.multiply(ballSpeed/ball.speed.magnitude());
            else if (ball.speed.magnitude() > ballSpeed * 2) ball.speed = ball.speed.multiply(0.5);
            currRect.life--;
            if (currRect.life <= 0) rectArray.splice(i,1);
            // TODO: animate rectangle destruction

        } 
    }

    // determine if a ball has collided with a prize
    for (var i=prizeArray.length-1; i>=0; i--) {
        var currPrize = prizeArray[i];
        if (ball.position.distance(currPrize.position) <= ball.radius) {
            // we've hit the prize, add it to the prizes awarded at the end of the turn and remove the prize
            prizesCaptured.push(currPrize);
            prizeArray.splice(i,1);
        }
    }
}

function checkEndGame() {
    if (state == "end_game") {
        c.font = "120px Arial";
        c.fillStyle = endGameColor;
        c.textBaseLine = 'middle';
        c.textAlign = 'center';
        c.fillText("Game Over", canvas.width/2, canvas.height/2);
        c.font = '60px Arial';
        c.fillText("Press any key to restart", canvas.width/2, canvas.height * 2/3);
        endGameColorCount++;
        if (endGameColorCount >= 10) {
            endGameColor = palettes.nextColor("Text", endGameColor);
            endGameColorCount = 0;
        }
    } 
    var font = textFontSize + "px Arial";
    c.font = font;
    c.fillStyle = "#A9A9A9";
    var pCount = prizeCount("balls", prizesCaptured);
    if (pCount == 0) c.fillText("Balls: " + ballCount, canvas.width * 1/5, 50); 
    else c.fillText("Balls: " + ballCount + " + " + pCount, canvas.width * 1/5, 50);
    c.fillText("Round: " + round, canvas.width * 2/5, 50);
    c.fillText("Score: " + score, canvas.width * 3/5, 50);
    if (score > hiScore) hiScore = score;
    c.fillText("High Score: " + hiScore, canvas.width * 4/5, 50);
    frames++;
    var elapsed = Date.now() - startTime;
    if (elapsed >= 1000) {
        fps = frames;
        frames = 0;
        startTime = Date.now();
    }    
    c.fillText("Font size: " + font, 100, canvas.height - 40);
    c.fillText("FPS: " + fps, canvas.width -100, canvas.height - 40);
}

init();

animate();


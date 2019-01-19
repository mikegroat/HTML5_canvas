// module aliases
var Engine = Matter.Engine,
   //Render = Matter.Render,
   //Runner = Matter.Runner,
   Composite = Matter.Composite,
   Composites = Matter.Composites,
   Common = Matter.Common,
   MouseConstraint = Matter.MouseConstraint,
   Mouse = Matter.Mouse,
   World = Matter.World,
   Bodies = Matter.Bodies,
   Body = Matter.Body,
   Bounds = Matter.Bounds,
   Events = Matter.Events;

// create an engine
var engine;
var world;

var balls = [],
   boxes = [],
   boundaries = [];

var cnv, cWidth, cHeight, aim;

var maxBalls = 100;
var numBalls = 0;
var ballStartX, ballStartY;
var ballDirX = 0;
var ballDirY = 0;
var states = ["setup", "waiting", "aiming", "shooting", "updating", "end"];
var currState = "setup";

var ballReleaseDistance = 10;
var ballSize = 5;
var boxSize = 20;
var ballSpeed = 0.001;
var round = 1;


function setup() {
   cWidth = windowWidth;
   cHeight = windowHeight;
   ballStartX = cWidth/2;
   ballStartY = cHeight - 20;
   cnv = createCanvas(cWidth, cHeight);
   cnv.style('display', 'block');
   engine = Engine.create();
   world = engine.world;
   // run the engine
   Engine.run(engine);

   engine.world.gravity.scale = 0;

   boundaries.push(new Boundary(-100, -100, cWidth+200, 100));
   boundaries.push(new Boundary(-100, -100, 100, cHeight+100));
   boundaries.push(new Boundary(cWidth, -100, 100, cHeight+100));

   // create two boxes
   boxes.push(new Box(world, 400, 200, boxSize, boxSize, round));
   boxes.push(new Box(world, 450, 50, boxSize, boxSize, round));

   Events.on(engine, "collisionStart", processCollisions);

   currState = "waiting";
}

function draw() {
   background(51);
   fill(255);
   // Engine.update(engine);
   for (i = 0; i < boxes.length; i++) {
      boxes[i].show();
   }
   console.log("current state is ", currState);

   if (currState == "aiming") aim.show(mouseX, mouseY);
   if (currState == "shooting") releaseABall();
   if (currState == "updating") doUpdate();
   for (i = balls.length - 1; i >= 0; i--) {
      if (isOffScreen(balls[i])) {
         balls[i].remove(world);
         balls.splice(i, 1);
      } else {
         balls[i].show();
      }
   }
   for (i = 0; i < boundaries.length; i++) {
      boundaries[i].show();
   }
}

function mousePressed() {
   if (currState == "waiting") {
      aim = new Aim(ballStartX, ballStartY); // TODO: change aim start x and y to variable
      currState = "aiming";
      console.log("updated current state to ", currState);
   }
}

function mouseReleased() {
   if (currState == "aiming") {
      aim = null;
      ballDirX = mouseX - ballStartX;
      ballDirY = mouseY - ballStartY;

      var dirLen = Math.sqrt(ballDirX * ballDirX + ballDirY * ballDirY);

      ballDirX /= dirLen / ballSpeed;
      ballDirY /= dirLen / ballSpeed;

      currState = "shooting";
      console.log("updated current state to ", currState);
      releaseABall();
   } else {
      console.log("warning: mouseReleased while current state is ", currState);
   }
}

function processCollisions(e) {
   var pairs = e.pairs;
   for (i=0; i<pairs.length; i++) {
      for (j=0; j<boxes.length; j++) {
         if (boxes[j].body.id == pairs[i].bodyA.id || boxes[j].body.id == pairs[i].bodyB.id) {
            //we have a collision with a box
            if (boxes[j].collide()) {
               //box is dead
               boxes[j].remove(world);
               boxes.splice(j, 1);
               j--;
            }
         }
      }
   }
}

function isOffScreen(obj) {
   return (obj.body.position.x < 0 || obj.body.position.x > cWidth || obj.body.position.y < 0 || obj.body.position.y > cHeight);
}

function releaseABall() {
   if (currState == "shooting") {
      if (numBalls < maxBalls) {
         console.log("shooting ball number ", balls.length + 1);
         if (balls.length > 0) {
            var bDist = balls[balls.length - 1].distance(ballStartX, ballStartY);
            console.log("ball distance is ", bDist);
            if (bDist > ballReleaseDistance) {
               numBalls++;
               balls.push(new Ball(world, ballStartX, ballStartY, ballSize));
               balls[balls.length - 1].send(ballDirX, ballDirY);
            }

         } else {
            numBalls++;
            balls.push(new Ball(world, ballStartX, ballStartY, ballSize));
            balls[balls.length - 1].send(ballDirX, ballDirY);
         }
      } else {
         if (balls.length == 0) {
            numBalls = 0;
            currState = "updating";
            console.log("updated current state to ", currState);   
         }
      }
   } else {
      console.log("warning: trying to release a ball when not shooting, but when current state is ", currState);
   }
   //    console.log(balls);
}

function doUpdate() {
   //move blocks down and generate a new row of blocks
   for (i=0; i<boxes.length; i++) {
      boxes[i].body.position.y += boxSize;
   }
   currState = "waiting";
   console.log("updated current state to ", currState);
   round++;
}
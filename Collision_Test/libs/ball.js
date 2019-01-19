function Ball(world, x, y, r) {
    var options = {
        friction: 0,
        frictionStatic: 1,
        frictionAir: 0,
        restitution: 1.1,
        collisionFilter: {
            group: 0,
            category: 0x0002,
            mask: 0x0001
        } 
    };

    this.r = r;
    this.body = Bodies.circle(x, y, this.r, options);
    this.world = world;
    var pos = {
        x: this.body.position.x,
        y: this.body.position.y
    };

    World.add(this.world, this.body);

    this.show = function() {
        pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        ellipseMode(CENTER);
        fill(100);
        ellipse(0,0, this.r*2);
        pop();
    };

    this.send = function(forceX, forceY) {
        var force = {
            x: forceX,
            y: forceY
        };
        Matter.Body.applyForce(this.body, pos, force);
    };

    this.remove = function(world) {
        World.remove(world, this.body);
        this.body = null;
    };

    this.distance = function(x, y) {
        var dx = pos.x - x;
        var dy = pos.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    };

}
function Box(world, x, y, w, h, maxval) {
    var options = {
        friction: 0,
        frictionStatic: 1,
        restitution: 1.1,
        isStatic: true,
        collisionFilter: {
            group: 0,
            category: 0x0001,
            mask: 0x0002
        } 

    };

    this.w = w;
    this.h = h;
    this.strength = 20;
    this.body = Bodies.rectangle(x, y, this.w, this.h, options);
    World.add(world, this.body);

    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        rect(0,0, this.w, this.h);
        pop();
    };

    this.collide = function() {
        this.strength--;
        return this.strength <= 0;
    };

    this.remove = function(world) {
        World.remove(world, this.body);
        this.body = null;
    };

}
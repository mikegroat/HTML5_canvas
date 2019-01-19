function Boundary(x, y, w, h) {
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
    var x1 = x+w/2;
    var y1 = y+h/2;
    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(x1, y1, this.w, this.h, options);
    World.add(world, this.body);

    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        noStroke();
        fill(255);
        rect(0,0, this.w, this.h);
        pop();
    };
}
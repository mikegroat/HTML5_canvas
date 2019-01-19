function Aim(startX, startY) {
    this.startX = startX;
    this.startY = startY;

    this.show = function(x, y) {
        stroke(255);
        line(this.startX, this.startY, x, y);
    };
}
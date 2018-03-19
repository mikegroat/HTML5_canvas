function Rectangle(x, y, height, width, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
    this.targetHeight = this.height;
    this.growAmount = 1;

    this.grow = function() {
        if ((this.height > this.targetHeight && this.growAmount > 0) || (this.height < this.targetHeight && this.growAmount < 0)) {
            this.targetHeight += randIntBetween(-100, 100);
            if (this.targetHeight <= 0) this.targetHeight = randIntBetween(10, 100);
            if (this.targetHeight >= canvas.height) this.targetHeight = canvas.height - randIntBetween(10, 100);
            if (this.targetHeight == this.height) this.targetHeight++;
            this.growAmount = this.targetHeight - this.height;
            // normalize growAmount, but keep direction
            this.growAmount = (this.growAmount / Math.abs(this.growAmount)) * randIntBetween(4, 8);
        }
        this.height += this.growAmount;
    }

    this.draw = function() {
        c.beginPath();
        c.strokeStylle = '#A9A9A9';
        c.rect(this.x, this.y - this.height, this.width, this.height);
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y - this.height, this.width, this.height);
    }
}


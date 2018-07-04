function Rectangle(x, y, height, width, color, outlineColor, life) {
    this.position = new Vector(x, y);
    this.target = this.position.copy();
    this.height = height;
    this.width = width;
    this.color = color;
    this.outlineColor = outlineColor;
    this.targetHeight = this.height;
    this.growAmount = 1;
    this.speed = {ul: undefined, ur: undefined, ll: undefined, lr: undefined};
    this.life = life;
    this.moveSteps = 10;

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
//        c.rect(this.position.x, this.position.y - this.height, this.width, this.height);
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y - this.height, this.width, this.height);
        c.strokeStyle = this.outlineColor;
        c.strokeRect(this.position.x, this.position.y - this.height, this.width, this.height);
        c.fillStyle = "#000000";
        c.font = "20px Arial";
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.life, this.position.x+(this.width/2), this.position.y-(this.width/2));
//        console.log('rectangle drawn = %s', JSON.stringify(this));
    }

    this.moveTo = function(toLoc) {
        this.target = toLoc;
        this.moveSteps = 10;                
    }

    this.update = function() {
        if (this.moveSteps > 0) {
            var diff = this.target.subtract(this.position);
            diff.x = diff.x/this.moveSteps;
            diff.y = diff.y/this.moveSteps;
            this.moveSteps--;
            this.position = this.position.add(diff);    
        }
    }
}


function Sparks() {

    var sparkArray = [];
    var sparkSizeFactor = 1;
    var colors = [];
    var curColor;
    var drawFunction = undefined;


    this.bigger = function(sizefactor) {
        this.sparkSizeFactor = sizefactor;
    }

    this.setDrawFunction = function(drawFunction = undefined) {
        this.drawFunction = drawFunction;
    }

    this.newSparks = function({posx, posy, dist = 4, num = 4, size = 20, speed = 4, colors}) {
        // validate the parameters
        if (posx == null || posy == null || colors == null) return false;
        // Create some new sparks
        var numSparks = randIntBetween(1,num);
        for (var i=0; i<numSparks; i++) {
            var x = posx + randIntBetween(- dist, dist);
            var y = posy + randIntBetween(- dist, dist);
            var dx = randIntBetween(-speed , speed);
            var dy = randIntBetween(-speed , speed);
            var r = randIntBetween(1, size) * this.sparkSizeFactor;
            var colors = colors;
            var color = randomColor(colorArray);
            var spark = new Particle(x, y, dx, dy, r, color);
            spark.setDrawFunction = this.drawFunction;
            spark.colors = colors;
            spark.curColor = -1;
            sparkArray.push(spark);    
        }
        return true;
    }

    this.update = function() {
        for (var i=sparkArray.length-1; i>=0; i--) {
            var spark = sparkArray[i];
            spark.radius--;
            if (spark.radius < 1) {
                sparkArray.splice(i,1);
            } else {
                spark.update();
                spark.draw();
            }
        }    
    }

    this.explode = function (speedfactor = 20, sizefactor = 2) {
        for (var i=0; i<sparkArray.length; i++) {
            sparkArray[i].speed = sparkArray[i].speed.multiply(speedfactor);
            sparkArray[i].radius *= sizefactor;
        }    
    }
}



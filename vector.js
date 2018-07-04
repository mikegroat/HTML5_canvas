// Library to do 2D or 3D vector math

function Vector(a = 0, b = 0, c = 0, type = 'cartesian') {
    if (type == 'cartesian') {
        this.x = a;
        this.y = b;
        this.z = c;
        polar(this);    
    } else if (type == 'polar') {
        this.r = a;
        this.theta = b;
        if (c == null) this.phi = 0; else this.phi = c;
        cartesian(this);    
    }

    this.add = function(vector) {
        var x = this.x + vector.x;
        var y = this.y + vector.y;
        var z = this.z + vector.z;
        return new Vector(x,y,z);
    }

    this.subtract = function(vector) {
        var x = this.x - vector.x;
        var y = this.y - vector.y;
        var z = this.z - vector.z;
        return new Vector(x, y, z);
    }

    this.distance = function(vector) {
        var lengthVec = this.subtract(vector);
        return Math.sqrt(lengthVec.x * lengthVec.x + lengthVec.y * lengthVec.y);
    }

    this.magnitude = function() {
        return this.r;
    }

    this.multiply = function(scalar) {
        var x = this.x * scalar;
        var y = this.y * scalar;
        var z = this.z * scalar;
        return new Vector(x, y, z);
    }

    this.copy = function() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return new Vector(x, y, z);
    }

    this.normalize = function() {
        return this.multiply(1/this.r);
    }

    function cartesian(vector) {
        vector.x = Math.cos(vector.theta) * Math.cos(vector.phi) * vector.r;
        vector.y = Math.sin(vector.theta) * Math.cos(vector.phi) * vector.r;
        vector.z = Math.sin(vector.phi) * vector.r;
    }

    function polar(vector) {
        vector.r = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
        vector.theta = Math.atan(vector.y/vector.x);
        vector.phi = Math.acos(vector.z / vector.r);
    }

    this.dot = function(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    this.cross = function(vector) {
        var x = this.y * vector.z - this.z * vector.y;
        var y = this.z * vecotr.x - this.z * vector.z;
        var z = this.x * vector.y - this.y * vector.x;
        return new Vector(x, y, z);
    }

}
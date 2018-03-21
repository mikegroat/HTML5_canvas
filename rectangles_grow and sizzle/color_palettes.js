    // A library for colors
    // Set the colors in the colorArray, using a color wheel program (like Adobe Kuler)
    // Each palette is an object with the following structure:
    // { name: "name", colors: [array of colors]}
function ColorPalettes() {

    this.palettes = [];

    this.createPalette = function(name, colors) {
        if (name != null & colors != null) {
            var palette = { name: name, colors: colors };
            this.palettes.push(palette);
        }
    }

    this.randomPalette = function() {
        return this.palettes[randIntBetween(0, this.palettes.length-1)];
    }

    this.randomColor = function(name) {
        var p = this.getPalette(name);
        var i = randIntBetween(0, p.colors.length - 1);
        return p.colors[i];
    }

    this.getPalette = function(name) {
        for (var i=0; i<this.palettes.length; i++) {
            if (this.palettes[i].name == name) return this.palettes[i]; 
        }
    }

    this.getColor = function(name, index) {
        var palette = this.getPalette(name);
        return palette.colors[index];
    }

}

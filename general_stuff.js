function randIntBetween(min, max) {
    var scope = max - min;
    return Math.floor(Math.random() * (scope + 1)) + min;
}

function randTF(trueProb = 0.5) {
    return Math.random() >= 1-trueProb;
}

function horizCenterOfText(canWidth, ctx, text) {
    var tWidth = ctx.measureText(text).width;
    return (canWidth-tWidth)/2;
}

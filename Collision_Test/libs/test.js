var tCount = 0;
var fCount = 0;
const numIts = 100000;
for (var i=0; i<numIts; i++) {
    if (randTF(0.5)) tCount++; else fCount++;
    if (i % 1000 == 0) console.log("%s iterations", i);
}
console.log("true %s% of the time", (tCount/numIts)*100);




function getInput() {
    var lines = require('fs').readFileSync('input.txt').toString();
    return lines.split(",").map(it => +it);
}

const input = getInput();
// const input = [16,1,2,0,4,2,7,1,2,14];
const [min, max] = [Math.min(...input), Math.max(...input)];
let best = 99999999999999;

for (let i = min; i <= max; i++) {
    let sum = input
        .map(it => Math.abs(i - it))
        .map(it => it * (1 + it)/2) // sum of values between 1 and it - only for b)
        .reduceRight((a,b) => a+b);
    best = Math.min(best, sum);  
}

console.log(best);
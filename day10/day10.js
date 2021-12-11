
function getInput() {
    var lines = require('fs').readFileSync('input.txt').toString();
    return lines.split("\n");
}

let chunks = {
    ')': { opener: '(', points: 3 },
    ']': { opener: '[', points: 57 },
    '}': { opener: '{', points: 1197 },
    '>': { opener: '<', points: 25137 },
};

let openers = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
};

let a = getInput().map(line => checkLine(line)[0]).reduce((a, b) => a + b);
let b = getInput().map(line => checkLine(line)[1]).filter(it => it > 0).sort((a, b) => a - b)

console.log("a", a);
console.log("b", b[Math.floor(b.length / 2)]);

function checkLine(line) {
    const openChunks = [];
    for (c of [...line]) {
        let chunk = chunks[c];
        if (chunk) { // a chunk-closer
            if (openChunks.pop() !== chunk.opener) {
                return [chunk.points, 0]; // a)
            }
        } else { //a chunk-opener
            openChunks.push(c);
        }
    }
    // b) 
    let b_points = openChunks.map(it => openers[it]).reduceRight((a, b) => 5 * a + b)
    return [0, b_points];
}
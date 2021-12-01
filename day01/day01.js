

const data = getInput();
// a)
let sum = 0;
for (let i = 1; i < data.length; i++) {
    if (data[i-1] < data[i]) {
        sum++;
    }
}
console.log("a: ", sum);


// b) 
sum = 0;
for(let i = 3; i < data.length; i++) {
    let prev = data[i-1] + data[i-2] + data[i-3];
    let curr = data[i] + data[i-1] + data[i-2];
    if (prev < curr) {
        sum++;
    }
}

console.log("b: ", sum);

function getInput() {
    var fs = require('fs');
    return fs.readFileSync('input.txt').toString().split("\n").map(it => +it);
}
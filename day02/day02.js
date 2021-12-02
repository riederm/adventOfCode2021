

const data = getInput();

let x = 0;
let y = 0;
let aim = 0;

for (const line of data) {
    const seg = line.split(" ");
    switch(seg[0]) {
        case 'forward': 
            x += +seg[1];
            y += +seg[1] * aim;
            break;
        case 'down':
            aim += +seg[1];
            break;
        case 'up':
            aim -= +seg[1];
            break;
    }
}

console.log("x: ", x, ", y: ", y);
console.log("product: ",  x * y);


function getInput() {
    var fs = require('fs');
    return fs.readFileSync('input.txt').toString().split("\n");
}
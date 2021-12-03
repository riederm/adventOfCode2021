


let gamma = [];
let epsilon = [];
let input = getInput();

for (let i = 0; i < input[0].length; i++) {
    let mostCommon = getMostCommonBit(input, i);
    gamma.push(''+mostCommon);
    epsilon.push('' + (1-mostCommon));
}

console.log("a:", parseInt(gamma.join(""), 2) * parseInt(epsilon.join(""), 2));

// b

//oxygen
let o2_input = input;
let co2_input = input;
for (let i = 0; i < input[0].length; i++) {
    let [o2_bit, co2_bit] = [
        getMostCommonBit(o2_input, i),
        1-getMostCommonBit(co2_input, i), //inverted
    ];
    if (o2_input.length > 1) o2_input = o2_input.filter(it => it.charAt(i) === ''+o2_bit);
    if (co2_input.length > 1) co2_input = co2_input.filter(it => it.charAt(i) === ''+co2_bit);
}

console.log("b:", parseInt(o2_input[0], 2)* parseInt(co2_input[0], 2));

function getMostCommonBit(input, i) {
    const oneFreq = input.filter(it => it.charAt(i) === '1').length;
    return oneFreq >= (input.length/2) ? 1: 0;
}

function getInput() {
    var fs = require('fs');
    return fs.readFileSync('input.txt').toString().split("\n");
}
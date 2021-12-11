function getInput() {
    lines = require('fs').readFileSync('input.txt').toString().split("\n");
    return lines.map(it => [...it].map(it => +it));
}

let field = getInput();
let coords = [];
for (let row = 0; row < field.length; row++)
    for (let col = 0; col < field[row].length; col++)
        coords.push([row, col]);

function getNeighbours(r, c, max) {
    let n = [];
    for (const dR of [-1, 0, 1])
        for (const dC of [-1, 0, 1])
            n.push([r + dR, c + dC]);

    return n
        .filter(([a, b]) => !(a == r && b == c))
        .filter(([a, b]) => a >= 0 && b >= 0 && a < max && b < max);
}

function flash(field) {
    //collect all coordinates that will flash
    let willFlash = coords.filter(([r, c]) => field[r][c] == 10);
    //propagate the flashes
    while (willFlash.length > 0) {
        let [r, c] = willFlash.pop();
        let litNeighbours = getNeighbours(r, c, field.length);
        //note which guys will also flash in a sec
        willFlash.push(...litNeighbours.filter(([r, c]) => field[r][c] == 9));
        //update the lit neighbours
        litNeighbours.forEach(([r, c]) => field[r][c] += 1);
    }

    let all_flashed = coords.filter(([r, c]) => field[r][c] > 9);
    all_flashed.forEach(([r, c]) => field[r][c] = 0); //clear everybody that flashed
    return all_flashed.length;
}

let [flashed, result_a, step] = [0,0,0];
while (!coords.every(([r, c]) => field[r][c] == 0)){
    step++;
    coords.forEach(([r, c]) => field[r][c] += 1);
    flashed += flash(field);
     console.log(`-------------- step ${step} ---------------`);
     console.log(field.map(it => it.map(c => c.toString(16))).map(it => it.join("")).join("\n"));
    if (step == 100){
        result_a = flashed;
    }
}

console.log("total flashes", result_a);
console.log("all flashed", step);
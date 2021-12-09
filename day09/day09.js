

function getInput() {
    var lines = require('fs').readFileSync('input.txt').toString();
    //     var lines = `2199943210
    // 3987894921
    // 9856789892
    // 8767896789
    // 9899965678`;
    return lines
        .split("\n")
        .map(it => [...it])
        .map(it => it.map(c => +c));
}

const map = getInput();

function get(map, x, y) {
    if (y >= 0 && y < map.length
        && x >= 0 && x < map[y].length) {
        return map[y][x];
    }
    return 999999;
}

const rel_neighbours = [
    //   x, y
    [-1, 0], // west
    [1, 0], // east
    [0, -1], // north
    [0, 1], // south
]

const basins = [];

let sum = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        const candidate = get(map, x, y);

        if (rel_neighbours
            .map(([_x, _y]) => [_x + x, _y + y])
            .every(([newX, newY]) => get(map, newX, newY) > candidate)) {

            basins.push([x, y]);
            sum += 1 + get(map, x, y)
        }
    }
}


let sizes = [];
[[0, 2], [3, 4], [2, 2]]
for (const [x, y] of basins) {
    let locations = [[x, y]]; //place start location

    let size = 0;
    while (locations.length > 0) {
        let [_x, _y] = locations.pop();
        if (get(map, _x, _y) < 9) {
            size++;
            map[_y][_x] = 9;
            let connected = rel_neighbours  
                .map(([x, y]) => [_x + x, _y + y])
                .filter(([x, y]) => get(map, x, y) < 9);

            locations.push(...connected);
        }
    }
    sizes.push(size);
}

console.log("a)", sum);
console.log("b)", sizes
    .sort((a, b) => b - a) //desc
    .slice(0, 3)
    .reduce((a, b) => a * b));




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

function is_valid(map, x,y) {
    if (y >= 0 && y < map.length){
        if (x >= 0 && x < map[y].length){
            return true;
        }
    }
    return false;
}

function get(map, x, y) {
    if (is_valid(map,x,y)){
            return map[y][x];
    }
    return 999999;
}

const directions = [
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
        
        const is_min = directions
            .map(([_x, _y]) => [_x + x, _y + y])
            .every(([newX, newY]) => get(map, newX, newY) > candidate);

        if (is_min){
            basins.push([x,y]);
            sum +=  1+get(map,x,y)
        }
    }
}

let sizes = [];

for (const [x,y] of basins) {
    let locations = [[x,y]]; //place start location

    let size = 0;
    while(locations.length > 0){
        let [_x, _y] = locations.pop();
        if (get(map,_x,_y) < 9){
            size++;
            map[_y][_x] = 9;
            
            let connected = directions.map(([dx,dy]) => [_x+dx, _y+dy])
            .filter(([nx,ny]) => get(map,nx,ny) < 9);
            
            locations.push(...connected);
        }
    }
    sizes.push(size);
}

let sorted_sizes = sizes.sort((a,b) => b-a);
console.log(sum);
console.log(sorted_sizes);

console.log(sorted_sizes[0]*sorted_sizes[1]*sorted_sizes[2]);


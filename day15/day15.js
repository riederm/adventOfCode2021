function getInput() {

    let lines = require('fs').readFileSync('input.txt').toString();
//     lines = `1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581`;

    //     lines = `1911191111
    // 1119111991
    // 9999999111
    // 9999911199
    // 9999119999
    // 9999199999
    // 9111199999
    // 9199999111
    // 9111911191
    // 9991119991`;

    let map = lines.split("\n")
        .map(l => [...l].map(it => { return { risk: +it, done: false, total: 99999999 }; }));

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map.length; x++) {
            map[y][x].x = x;
            map[y][x].y = y;
        }
    }
    return map;
}

function enlarge_map(map) {

    let new_map = Array(map.length * 5);
    for (let i = 0; i < new_map.length; i++) {
        new_map[i] = Array(map[0].length * 5);
    }


    for (let dy = 0; dy < 5; dy++) {
        for (let dx = 0; dx < 5; dx++) {
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[0].length; x++) {
                    let _x = x + (dx*map[0].length);
                    let _y = y + (dy*map.length);
                    new_map[_y][_x] = { ...map[y][x] };

                    let new_risk = (new_map[_y][_x].risk + dy + dx);
                    if (new_risk <= 9) {
                        new_map[_y][_x].risk = new_risk;
                    }else{
                        new_map[_y][_x].risk = new_risk % 9;
                    }
                    new_map[_y][_x].risk = Math.max(1,                     new_map[_y][_x].risk);
                    new_map[_y][_x].x = _x;
                    new_map[_y][_x].y = _y;
                }
            }
        }
    }
    return new_map;
}

let map = enlarge_map(getInput());
for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
        if (x % 5 == 0) {
            line += "|"
        }
        line += map[y][x].risk;
    }
    // console.log(line);
}

let directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
];

preProcess(pos(0, 0), map);

function pos(x, y) {
    return { x: x, y: y };
}

function neighbours(p) {
    return directions.map(it => pos(it.x + p.x, it.y + p.y))
        .filter(it => it.x >= 0 && it.x < map[0].length)
        .filter(it => it.y >= 0 && it.y < map.length);
}


function preProcess(from, map) {
    map[from.y][from.x].total = 0;
    nodes = [from];

    let Q = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            Q.push(map[y][x]);
        }
    }

    Q = Q.sort((a, b) => a.total - b.total);

    while (Q.length > 0) {
        if (Q.length % 100 === 0) {
            console.log(Q.length);
        }
        let u = Q.splice(0, 1)[0];
        u.done = true;
        let neighbours_ = neighbours(u);
        for (n of neighbours_.filter(it => !it.done)) {
            let v = map[n.y][n.x];
            let alt = u.total + v.risk;
            if (alt < v.total) {
                v.total = alt;
                v.prev = pos(u.x, u.y);
            }
        }
        Q = Q.sort((a, b) => a.total - b.total);
    }
}

let path = [];
let current = map[map[0].length - 1][map.length - 1];
while (!(current.x == 0 && current.y == 0)) {
    path.push({ ...current });
    current = map[current.y][current.x].prev;
    if (!current) {
        console.log("xxx")
    }
}
path.push(pos(0, 0))
console.log(path.reverse());

let cost = path.map(it => map[it.y][it.x].risk).reduce((a, b) => a + b);
console.log(cost - map[0][0].risk);
console.log(map[9][9].total - map[0][0].risk - map[9][9].risk);


//print
let sum = 0;
map[0][0].risk = 0;
for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
        let isPath = path.some(it => it.x == x && it.y == y);
        if (isPath) {
            sum += map[y][x].risk;
        }
        let marker = isPath ? "|" : " ";
        line += `${marker}${map[y][x].risk.toLocaleString("en-Us", { minimumIntegerDigits: 2 })}${marker}`;
    }
    console.log(line);
}
console.log(sum)

function getInput() {
    let text = require('fs').readFileSync('input.txt').toString();
    let lines = text.split("\n");
    let n = 0;
    let coords = [];
    while (lines[n].trim() !== '') {
        let segments = lines[n].split(",");
        coords.push({ x: +segments[0], y: +segments[1] });
        n++;
    }
    n++;
    let folds = [];
    for (let i = n; i < lines.length; i++) {
        let fold = lines[i].replace("fold along ", "").split("=");
        folds.push({ direction: fold[0], operator: +fold[1] });
    }
    console.log("coords", coords);
    console.log("folds", folds);

    return {
        points: coords,
        folds: folds,
    };
}

function print(data) {
    let maxX = data.points.map(it => it.x).reduce((a, b) => Math.max(a, b))+1;
    let maxY = data.points.map(it => it.y).reduce((a, b) => Math.max(a, b))+1;
    let map = [...Array(maxY).keys()].map(it => [...Array(maxX).keys()].map(it => "."));
    for (const p of data.points) {
        map[p.y][p.x] = "#";
    }
    console.log(map.map(line => line.join("")).join("\n"));
}

let data = getInput();
let n = 0;
for (f of data.folds) {
    console.log("--------------------");
    if (f.direction == "x") {
        let remaining = data.points.filter(it => it.x < f.operator);
        let foldedPoints = data.points.filter(it => it.x > f.operator)
            .map(it => { return { y: it.y, x: f.operator - (it.x - f.operator) }; })
            .filter( it => remaining.every(p => p.x != it.x || p.y != it.y));
        data.points = [...remaining, ...foldedPoints];

    } else {  //y
        let remaining = data.points.filter(it => it.y < f.operator);
        let foldedPoints = data.points.filter(it => it.y > f.operator)
            .map(it => { return { x: it.x, y: f.operator - (it.y - f.operator) }; })
            .filter( it => remaining.every(p => p.x != it.x || p.y != it.y));
        data.points = [...remaining, ...foldedPoints];
    }
    console.log(`after fold ${n+1}`, data.points.length);
    n++;
}

print(data);

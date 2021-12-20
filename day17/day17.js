
function getInput() {
    let text = 'target area: x=20..30, y=-10..-5'; //training
    text = 'target area: x=185..221, y=-122..-74';
    return text.replace("target area: ", "")
        .split(", ").map(it => it.substring(2).split("..").map(it => +it));
}

function xy(x, y) {
    return { x: x, y: y };
}

function add(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}
function decrease(x) {
    if (x == 0) return 0;
    return x > 0 ? x - 1 : x + 1;
}

let [x_area, y_area] = getInput();
let target = {
    min_x: x_area[0],
    max_x: x_area[1],
    min_y: -y_area[1],  //flip!!
    max_y: -y_area[0],
}

// console.log(x_area, y_area); 

let min_y = 99999999999;
let current_y = 10000;
console.log(shoot(xy(7,-2), xy(0,0)))
let count = 0;
do{
    found = false;
    for (let x = 1; x <= target.max_x; x++) {
        let result = shoot(xy(x, current_y), xy(0, 0));
        if (result) {
            count++; 
            found = true;
            min_y = Math.min(min_y, result[1]);
            console.log(min_y, count);
        }
    }
    current_y--;
}while(found || min_y > 0 ||true);

console.log("best height", -min_y);

function shoot(v, pos) {
    let min_y = 99999;
    while (pos.x <= target.max_x && pos.y <= target.max_y) {
        min_y = Math.min(pos.y, min_y);
        // console.log(pos, v);
        pos = add(v, pos);
        if (pos.x >= target.min_x && pos.x <= target.max_x && pos.y >= target.min_y && pos.y <= target.max_y) {
            return [pos, min_y];
        }
        v = xy(decrease(v.x), v.y+1);
    }
    return undefined;
}

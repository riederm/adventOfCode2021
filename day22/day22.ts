
class Action {
    on: boolean;
    x_min: number;
    x_max: number;
    y_min: number;
    y_max: number;
    z_min: number;
    z_max: number;
}


function getInput() {
    let lines = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`.split("\n");


    lines = require('fs').readFileSync('input.txt').toString().split("\n");


    return lines.map(it => {
        let segments = it.split(" ");
        let on = segments[0] == 'on';
        let coords = segments[1].split(",");
        let a = new Action();
        a.on = on;
        let [x_min, x_max] = coords[0].substring(2).split("..").map(it => +it);
        let [y_min, y_max] = coords[1].substring(2).split("..").map(it => +it);
        let [z_min, z_max] = coords[2].substring(2).split("..").map(it => +it);
        a.x_min = Math.max(x_min, -50);
        a.y_min = Math.max(y_min, -50);
        a.z_min = Math.max(z_min, -50);

        a.x_max = Math.min(x_max, 50);
        a.y_max = Math.min(y_max, 50);
        a.z_max = Math.min(z_max, 50);
        return a;
    }).filter(it => it.x_min <= it.x_max && it.y_min <= it.y_max && it.z_min <= it.z_max);
}

let input = getInput();
let world = {};

for (const a of input) {
    for (let z = a.z_min; z <= a.z_max; z++) {
        for (let y = a.y_min; y <= a.y_max; y++) {
            for (let x = a.x_min; x <= a.x_max; x++) {
                let key = `${x},${y},${z}`;
                if (a.on){
                    world[key] = true;
                }else{
                    delete world[key];
                }
            }
        }
    }
    console.log("...")
}

console.log(Object.keys(world));
console.log(Object.keys(world).length);
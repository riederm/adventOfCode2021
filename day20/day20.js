
function getInput() {
    let text = require('fs').readFileSync('input.txt').toString();
    let segments = text.split("\n\n");
    let code = segments[0];
    let map = segments[1].split("\n").map(it => [...it]);
    return [code, map];
}

class Picture {
    constructor(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.points = {};
        this.default_value = '.';
    }

    set(x, y, val) {
        if (val == '#') {
            this.points[x + "," + y] = true;
        }
    }

    get(x, y) {
        //outside of the picture, we return the default
        if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) return this.default_value;
        return this.points[x + "," + y] === true ? '#' : ".";
    }

    print() {
        for (let y = this.minY; y <= this.maxY; y++) {
            let line = '';
            for (let x = this.minX; x <= this.maxX; x++) {
                line += this.get(x, y);
            }
            console.log(line)
        }
    }

    enhance(lookup) {
        let pic = this;
        let newPic = new Picture(pic.minX - 1, pic.maxX + 1, pic.minY - 1, pic.maxY + 1);
        //see what the infinite are will become
        let default_pix = [...Array(9).keys()].map(it => pic.default_value).join("");
        newPic.default_value = lookup[default_pix];

        const dir = [-1, 0, 1];
        for (let y = newPic.minY; y <= newPic.maxY; y++) {
            for (let x = newPic.minX; x <= newPic.maxX; x++) {
                let code = '';
                for (const dy of dir) {
                    for (const dx of dir) {
                        code += pic.get(x + dx, y + dy);
                    }
                }
                newPic.set(x, y, lookup[code]);
            }
        }
        return newPic;
    }
}


let [code, map_arr] = getInput();
//build the picture
let p = new Picture(0, map_arr[0].length - 1, 0, map_arr.length - 1, ".");
for (let y = 0; y < map_arr.length; y++) {
    for (let x = 0; x < map_arr.length; x++) {
        p.set(x, y, map_arr[y][x]);
    }
}
//build code lookup map
let lookup = {};
for (let i = 0; i < 512; i++) {
    let bin = i.toString(2).padStart(9, "0").replaceAll("0", ".").replaceAll("1", '#');
    lookup[bin] = code[i];
}

// do the enhancements
for (let i = 0; i < 50; i++) {
    if (i == 2) {
        console.log("a)", Object.keys(p.points).length);
    }
    p = p.enhance(lookup);
}
console.log("b)", Object.keys(p.points).length);
// m.print();


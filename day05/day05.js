

function getInput() {
    var fs = require('fs');
    var lines = fs.readFileSync('input.txt').toString().split("\n");
    return lines.map(l => {
        const points = l.split(" -> ");
        p1 = points[0].split(",");
        p2 = points[1].split(",");
        return [+p1[0], +p1[1], +p2[0], +p2[1]];
    });
}

class Map {
    fields = {};
    minX = 10000000000; maxX = 0;
    minY = 10000000000; maxY = 0;

    print() {
        for (let y = this.minY; y <= this.maxY; y++) {
            let line = '';
            for (let x = this.minX; x <= this.maxX; x++) {
                const v = this.get(x, y);
                line += v == 0 ? "." : v;
            }
            console.log(line);
        }
    }

    key(x, y) {
        return x + ',' + y;
    }

    bump(x, y) {
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);
        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
        this.fields[this.key(x, y)] = this.get(x, y) + 1;
    }

    get(x, y) {
        const v = this.fields[this.key(x, y)];
        return v ? v : 0;
    }

    countBigger1() {
        return Object.values(this.fields).filter(it => it > 1).length;
    }

    drawLine(x1, y1, x2, y2, allowDiagonal) {
        let delta_x = x1 == x2 ? 0 : x1 < x2 ? +1 : -1;
        let delta_y = y1 == y2 ? 0 : y1 < y2 ? +1 : -1;

        // for part a, skip stuff thats not horizontal or vertical
        if (!allowDiagonal && delta_x != 0 && delta_y != 0) return

        let x = x1; let y = y1;
        while (x !== x2 || y !== y2) {
            this.bump(x, y);
            x += delta_x;
            y += delta_y;
        }
        this.bump(x, y);    // the loop skips the last point :-(
    }
}

const map_a = new Map();
const map_b = new Map();
getInput().forEach(it => {
    map_a.drawLine(it[0], it[1], it[2], it[3], false)
    map_b.drawLine(it[0], it[1], it[2], it[3], true)
});
console.log("a)", map_a.countBigger1());
console.log("b)", map_b.countBigger1());

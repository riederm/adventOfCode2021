import { runInThisContext } from "vm";

console.log("hello world");
const sin_90 = 1;
const cos_90 = 0;

function getInput() {
    let text = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`.split("\n\n");

    text = require('fs').readFileSync('input.txt').toString().split("\n\n");

    return text.map(it => {
        let lines = it.split("\n");
        let points = lines.slice(1).map(it => {
            let coords = it.split(",");
            return new Vec3D(+coords[0], +coords[1], +coords[2]);
        });
        return new Scanner(points);
    });

}

class Scanner {
    public reference = new Vec3D(7, 3, 11);

    constructor(public points: Vec3D[]) { }

    rotate90_x() {
        this.points.forEach(it => it.rotate90_x());
        this.reference.rotate90_x();
        this.pointCache = null;
    }

    rotate90_y() {
        this.points.forEach(it => it.rotate90_y());
        this.reference.rotate90_y();
        this.pointCache = null;
    }

    rotate90_z() {
        this.points.forEach(it => it.rotate90_z());
        this.reference.rotate90_z();
        this.pointCache = null;
    }

    getMatches(other: Scanner) {
        let cache = this.getPointCache(); 
        return other.points.filter(it => cache.has(it.toString()));
    }

    import(toImport: Vec3D[]){
        let c = this.getPointCache();
        for (const p of toImport) {
            if (!c.has(p.toString())) {
                this.points.push(p);
                c.add(p.toString())
            }
        }
    }

    pointCache: Set<String> | null = null;
    getPointCache() {
        if (this.pointCache == null){
            this.pointCache = new Set(this.points.map(it => it.toString()));
        }
        return this.pointCache;
    }

    move(delta: Vec3D) {
        this.points.forEach(it => it.move(delta));
    }
}


class Vec3D {
    constructor(public x: number, public y: number, public z: number) {
    }

    add(other: Vec3D): Vec3D {
        return new Vec3D(this.x + other.x, this.y + other.y, this.z + other.y);
    }

    move(other: Vec3D) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    diff(other: Vec3D): Vec3D {
        return new Vec3D(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    negate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
    }

    private mult(x: number, y: number, z: number) {
        return this.x * x + this.y * y + this.z * z;
    }

    rotate90_x() {
        let x = this.mult(1, 0, 0);
        let y = this.mult(0, cos_90, -sin_90);
        let z = this.mult(0, sin_90, cos_90);
        this.x = x;
        this.y = y;
        this.z = z;

    }
    rotate90_y() {
        let x = this.mult(cos_90, 0, sin_90);
        let y = this.mult(0, 1, 0);
        let z = this.mult(-sin_90, 0, cos_90);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    rotate90_z() {
        let x = this.mult(cos_90, -sin_90, 0);
        let y = this.mult(sin_90, cos_90, 0);
        let z = this.mult(0, 0, 1);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    eq(other: Vec3D) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    toString() {
        return `${this.x},${this.y},${this.z}`;
    }
}

/**
 * returns the candidate in the correct rotation that matches the reference, or undefined
 * @param reference the reference system
 * @param candidate the candidate that whill be rotated and moved
 */
function findMatch(reference: Scanner, candidate: Scanner): Scanner | null {
    let checkedRotations = new Set();
    //now try all rotations
    for (let z = 0; z < 4; z++) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let rotation_reference = candidate.reference.toString();
                if(checkedRotations.has(rotation_reference)){
                    continue; 
                }
                checkedRotations.add(rotation_reference);

                //for the current rotation, ... 
                for (const ref_point of reference.points) {
                    for (const c_point of candidate.points) {
                        //move the candidate system so ref_point == c_point
                        let delta = c_point.diff(ref_point);
                        // delta.negate();
                        candidate.move(delta);
                        //see how much points will match
                        let matches = reference.getMatches(candidate);
                        if (matches.length >= 12) {
                            //match!!
                            return candidate;
                        }
                    }
                }
                candidate.rotate90_x();
            }
            candidate.rotate90_y();
        }
        candidate.rotate90_z();
    }
    return null;
}


let scanners = getInput();
//consider scanner 0 as known
let known_scanner = scanners.splice(0, 1)[0];

let change = true;
while (change) {
    change = false;
    let found = [];
    for (let c = 0; c < scanners.length; c++) {
        let candidate = scanners[c];
        //try it against all known scanners
        let match = findMatch(known_scanner, candidate);
        if (match) {
            change = true;
            found.push(match);
            known_scanner.import(match.points);
        }
    }
    console.log(known_scanner.points.length);
    if (found.length > 0){
        console.log(found.map(it => scanners.indexOf(it)))
        found.forEach(it => scanners.splice(scanners.indexOf(it)));
        console.log("YES - found ", found.length, ",", scanners.length, "to go")
    }
}

console.log(known_scanner.points.length);
// console.log(known_scanner.points.map(it => it.toString()).sort((a, b) => a.localeCompare(b)));
console.log(scanners.length, "could not be matched!!!");
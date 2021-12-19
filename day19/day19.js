
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
553,889,-390`.split("\n\n");
    /*
    text = `--- scanner 0 ---
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
    30,-46,-14`.split("\n\n");*/

    return text.map(it => {
        let lines = it.split("\n");
        return lines.slice(1).map(it => {
            let coords = it.split(",");
            return new Vec3D(+coords[0], +coords[1], +coords[2]);
        })

    });
}

const sin_90 = 1;
const cos_90 = 0;

class ScannerViews {
    constructor(scanners) {
        this.scanners = scanners;
    }

}

class Scanner {


    constructor(beacons) {
        this.beacons = beacons;
        this.rot_x = 0;
        this.rot_y = 0;
        this.rot_z = 0;
        this.pos = undefined;
    }

    getRotationCode() {
        return `rx=${this.rot_x},ry=${this.rot_y},rz=${this.rot_z}`;
    }

    clone() {
        let newBeacons = this.beacons.map(it => it.clone());
        let newScanner = new Scanner(newBeacons);
        newScanner.rot_x = this.rot_x;
        newScanner.rot_y = this.rot_y;
        newScanner.rot_z = this.rot_z;
        return newScanner;

    }

    rotate90_x() {
        this.beacons = this.beacons.map(b => b.rotate90_x());
        this.rot_x = (this.rot_x + 1) % 4;
    }
    rotate90_y() {
        this.beacons = this.beacons.map(b => b.rotate90_y());
        this.rot_y = (this.rot_y + 1) % 4;
    }
    rotate90_z() {
        this.beacons = this.beacons.map(b => b.rotate90_z());
        this.rot_z = (this.rot_z + 1) % 4;
    }

    getAllPossibleRotations() {
        let s = this.clone();
        let solutions = [];

        for (let z = 0; z < 4; z++) { 
            for (let y = 0; y < 4; y++) { 
                for (let x = 0; x < 4; x++) { 
                    solutions.push(s.clone());
                    s.rotate90_x();
                }
                s.rotate90_y();
            }
            s.rotate90_z();
        }
        return solutions;
    }

    getMatches(other) {
        let aa = this.beacons.filter(it => other.beacons.some(s => s.equals(it)));
        return aa;
    }

    centerOn(vec) {
        vec = vec.clone();
        for (const b of this.beacons) {
            b.makeRelative(vec);
        }
        return vec.clone();
    }
}

class Vec3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    vec_add(other){
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    vec_mult(_x, _y, _z) {
        return this.x * _x + this.y * _y + this.z * _z;
    }

    rotate90_x() {
        let x = this.vec_mult(1, 0, 0);
        let y = this.vec_mult(0, cos_90, -sin_90);
        let z = this.vec_mult(0, sin_90, cos_90);
        return new Vec3D(x, y, z);
    }

    rotate90_y() {
        let x = this.vec_mult(cos_90, 0, sin_90);
        let y = this.vec_mult(0, 1, 0);
        let z = this.vec_mult(-sin_90, 0, cos_90);
        return new Vec3D(x, y, z);
    }

    rotate90_z() {
        let x = this.vec_mult(cos_90, -sin_90, 0);
        let y = this.vec_mult(sin_90, cos_90, 0);
        let z = this.vec_mult(0, 0, 1);
        return new Vec3D(x, y, z);
    }

    clone() {
        return new Vec3D(this.x, this.y, this.z);
    }

    makeRelative(otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        this.z -= otherVec.z;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

}

function print(bacons) {
    let max_x = Math.max(...bacons.map(it => it.x), 0);
    let min_x = Math.min(...bacons.map(it => it.x), 0);
    let max_y = Math.max(...bacons.map(it => it.y), 0);
    let min_y = Math.min(...bacons.map(it => it.y), 0);
    let lines = [];
    for (let y = min_y; y <= max_y; y++) {
        let line = '';
        for (let x = min_x; x <= max_x; x++) {
            if (y == 0 && x == 0) {
                line += 'S';
            } else if (bacons.some(it => it.x == x && it.y == y)) {
                line += 'B';
            } else {
                line += '.';
            }
        }
        lines.push(line);
    }
    console.log(lines.reverse().join("\n"));
}

function findBestMatch(s1, s2) {
    let correction = new Vec3D(0,0,0);
    for (const b1 of s1.beacons) {
        correction.vec_add(b1);
        //center on b
        s1.centerOn(b1);
        for (const s of s2.getAllPossibleRotations()) {
            let correction2 = new Vec3D(0,0,0);
            for (const b2 of s.beacons) {
                correction2.vec_add(b2);
                s.centerOn(b2);
                let matches = s1.getMatches(s);
                if (matches.length >= 12) {
                    //add all from s1 and corrected s2
                    let set = new Set();
                    // set.add(...s.beacons.map(it => `${it.x+correction.x},${it.y+correction.y},${it.z+correction.z}`);
                    // set.add(...s1.beacons.map(it => `${it.x+correction.x},${it.y+correction.y},${it.z+correction.z}`);
                    //correct s2
                    return ;
                }
            }
        }
    }
    return [];
}

let scanners = getInput().map(it => new Scanner(it));
// let known =[scanners.splice(0, 1)];

//assume scanner0 is at 0,0,0
// let known = [];
// scanners[0].pos = new Vec3D(0,0,0);
// known.push(scanners.splice(0,1));

// for (const k of known) {
//     for (let i = 0; i < scanners.length; i++) {
//         const candidate = scanners[i];
//         if (findBestMatch(k, candidate)){

//         }
//     }
// }

let s1 = scanners[0];
let s2 = scanners[1];


// let matching_bacons = findBestMatch(s1, s2);
// matching_bacons.sort((a,b) => a.localeCompare(b));
// console.log(matching_bacons);

//this is what we want!
console.log(`-618,-824,-621
-537,-823,-458
-447,-329,318
404,-588,-901
544,-627,-890
528,-643,409
-661,-816,-575
390,-675,-793
423,-701,434
-345,-311,381
459,-707,401
-485,-357,347`.split("\n").sort((a,b) => a.localeCompare(b)));



let v1 = new Vec3D(1,2,3);
let s = new Scanner([v1]);
let vecs = s.getAllPossibleRotations().map(it => it.beacons[0]);
console.log(vecs.length)

let strings = vecs.map(it => `${it.x},${it.y},${it.z}`);
let set = new Set(strings);
console.log(set.size);
console.log(set);
// let v2 = Vec3D(1,0,0);
// let v3 = Vec3D(1,0,0);

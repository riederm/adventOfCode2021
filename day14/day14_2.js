function getInput() {
    let text = require('fs').readFileSync('input.txt').toString();
    text = `NNCB

    CH -> B
    HH -> N
    CB -> H
    NH -> C
    HB -> C
    HC -> B
    HN -> C
    NN -> C
    BH -> H
    NC -> B
    NB -> B
    BN -> B
    BB -> N
    BC -> B
    CC -> N
    CN -> C`;

    let segments = text.split("\n\n");
    let input = segments[0];

    let projections = {};
    segments[1].split("\n").map(it => it.split(" -> ")).forEach(elements => {
        let chars = [...elements[0].trim()];
        projections[elements[0].trim()] = elements[1].trim();
    });;
    return [input, projections];
}

let memory = {};
let [input, projections] = getInput();
input = [...input];
let freq ={};

count(input[0], freq); //we skip this guy

for (let i = 1; i < input.length; i++) {
    process.stdout.write(input[i-1]);
    resolve(input[i-1], input[i], 0, freq);
}

function count(a, freq) {
    freq[a] = freq[a] ? freq[a]+1: 1;
}

function resolve(a,b, depth, freq) {
    if (depth >= 10) {
        let f = {};
        // count(a, f);
        count(b, f);
        memory[a+b+depth] = f;
        // process.stdout.write(b);
        count(b, freq);
        return b;
    }

    
    resolve(a, projections[a+b], depth+1, freq);
    //note that we've been here
    // memory[a,projections[a+b]+depth] = 


    resolve(projections[a+b], b, depth+1, freq);

    //keep note that we fully visited a,b in the depth
    // memory[a+b+depth] = JSON.parse(JSON.stringify(freq));
}

console.log(memory);

let max = -1;
let min = 999999999999;
for (const key in freq) {
    max = Math.max(max, freq[key]);
    min = Math.min(min, freq[key]);
}

console.log("day14");
console.log(max, min, max - min);

// for (let step = 0; step < 20; step++) {
//     let i = 0;
//     let next = '';
//     while (i < input.length - 1) {
//         //find production
//         let keys = Object.keys(projections).sort((a, b) => b.length - a.length)
//         for (let k = 0; k < keys.length; k++) {
//             const key = keys[k];
//             let candidate = input.substring(i, i + key.length);
//             if (candidate == key) {
//                 next += projections[key];
//                 i += key.length - 1;
//                 break;
//             }
//         }
//     }
//     next += input[input.length - 1];
//     console.log(`step: ${step}`, next.length);
//     input = next;
// }


function getInput() {
    let text = require('fs').readFileSync('input.txt').toString();
    //     text = `NNCB

    // CH -> B
    // HH -> N
    // CB -> H
    // NH -> C
    // HB -> C
    // HC -> B
    // HN -> C
    // NN -> C
    // BH -> H
    // NC -> B
    // NB -> B
    // BN -> B
    // BB -> N
    // BC -> B
    // CC -> N
    // CN -> C`;

    let segments = text.split("\n\n");
    let input = [...segments[0]];

    let projections = {};
    segments[1].split("\n").map(it => it.split(" -> ")).forEach(elements => {
        projections[elements[0]] = elements[1];
    });;
    return [input, projections];
}

let [input, projections] = getInput();
console.log(input);
console.log(projections);

let memory = {};
for (let step = 1; step <= 40; step++) {
    let next = "";
    for (let i = 1; i < input.length; i++) {
        let sortedKeys = Object.keys(memory).sort((a, b) => b.length - a.length);
        let inputStr = input.join();
        let skip = false;
        for (k of sortedKeys) {
            //check if we know this sub-element
            if (memory[inputStr.substring(i, i+k.length)] == k) {
                next = [...input, ...memory[k]];
                i += k.length;
                skip = true;
                break;
            }
        }

        if (!skip){
            let key = input[i - 1] + input[i];
            let p = projections[key];
            next += input[i - 1] + p;
        }

    }
    next += input[input.length - 1];
    // console.log("step", step, next);
    memory[input] = next;
    input = [...next];
    console.log(step)
}

let freq = {};
input.forEach(it => {
    freq[it] = freq[it] ? freq[it] + 1 : 1;
});

let max = -1;
let min = 999999999999;
for (const key in freq) {
    max = Math.max(max, freq[key]);
    min = Math.min(min, freq[key]);
}

console.log("day14");
console.log(max, min, max - min);
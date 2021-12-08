function getInput() {
    var lines = require('fs').readFileSync('input.txt').toString();
    return lines
        .split("\n")
        .map(it => it.split("|"))    
        .map(it => [it[0].trim().split(" "), it[1].trim().split(" ")]);
}

const existing_patterns = [
    "abcefg", // 0
    "cf", // 1
    "acdeg", // 2
    "acdfg", // 3
    "bcdf", // 4
    "abdfg", // 5
    "abdefg", // 6
    "acf", //7
    "abcdefg", // 8
    "abcdfg", //9
];

let sum = 0;
let possible_mappings = [];
build_candidates({}, [..."abcdefg"], [..."abcdefg"], (it) => possible_mappings.push({...it}));
for (const [scrambled_numbers, output] of getInput()) {
    //try the input for all possible mappings and pick one where all input work
    let best_mapping = possible_mappings.find(m => scrambled_numbers.every(it => resolve(m, it) >= 0));
    sum += +output.map(number => +resolve(best_mapping, number) + "").join("");
}
console.log(sum);

function build_candidates(mapping, output, remaining_wires, callback) {
    const signal = output.pop();
    for (c of remaining_wires) {
        mapping[signal] = c;
        if (output.length == 0){
            callback(mapping); //complete mapping
        }else{
            build_candidates(mapping, output, remaining_wires.filter(it => it !== c), callback);
        }
    }
    output.push(signal)
}

function resolve(mapping, scrambled_number) {
    let result = [...scrambled_number]
                        .map(seg => mapping[seg])
                        .sort()
                        .join("")
    return existing_patterns.indexOf(result);
}

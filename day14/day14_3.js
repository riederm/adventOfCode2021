

let text = require('fs').readFileSync('input.txt').toString();
    let segments = text.split("\n\n");
    let template = segments[0];

    let rules = {};
    segments[1].split("\n").map(it => it.split(" -> ")).forEach(elements => {
        let chars = [...elements[0].trim()];
        rules[elements[0].trim()] = elements[1].trim();
    });;




// add 'amm' to obj[key]
function objInc(obj, key, amm) {
  const ammount = (amm === undefined ? 1 : amm);
  if (key in obj)
    obj[key] += ammount;
  else
    obj[key] = ammount;
  return obj;
}

// for each pair in pairs
// given a pair 'AB' with count of N
// given a particular rule 'AB' -> C
// increase global counts of pair 'AC' by N and pair 'CB' by N
function polymerize(pairs) {
  let result = Object.create(null);
  for (let pair in pairs) {
    const insert = rules[pair];
    objInc(result, pair[0] + insert, pairs[pair]);
    objInc(result, insert + pair[1], pairs[pair]);
  }
  return result;
}

// save first and last letter from template for later
const edges = [template[0], template[template.length-1]];

// from the initial template, split it up into pairs and count them up
let pairs = template.split('').map((v, idx, arr) => v + arr[idx+1]).slice(0, -1).reduce((obj, v) => objInc(obj, v), Object.create(null));

// polymerization, 40 steps
for (let i = 0; i < 40; ++i)
  pairs = polymerize(pairs);

// postprocess to get a response
function counts(pairs) {
  let result = Object.create(null);

  // each pair has 2 letters. sum up all letters in all pairs
  for (let pair in pairs) {
    objInc(result, pair[0], pairs[pair]);
    objInc(result, pair[1], pairs[pair]);
  }

  // edge letters from the initial template were counted just once while the rest was duplicated
  result[edges[0]] += 1;
  result[edges[1]] += 1;
  for (let key in result)
    result[key] /= 2;

  return result;
}

const letterCounts = counts(pairs);
const sortedCounts = Object.values(letterCounts).sort((l, r) => r - l);
const answer = sortedCounts[0] - sortedCounts[sortedCounts.length-1];

console.log(`Answer: ${answer}`);
console.assert(answer == 2875665202438, "Expected 2875665202438");
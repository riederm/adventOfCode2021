
function getInput() {
    let graph = {};
    let lines = require('fs').readFileSync('input.txt').toString();
    lines.split("\n").map(it => it.split("-"))
        .forEach(([from, to]) => {
            graph[from] = graph[from] ? graph[from] : [];
            graph[to] = graph[to] ? graph[to] : [];
            graph[from].push(to);
            graph[to].push(from);
        });
    return graph;
}

let g = getInput();
let path = ['start'];
let solutions = [];
walk(path, solutions);
console.log(solutions
            .map(it => it.join(","))
            .sort((a, b) => a.localeCompare(b)));
console.log("#:", solutions.length);

function walk(path, solutions) {
    let pos = path.at(-1); //last
    if (pos == 'end') {
        solutions.push([...path]);
    } else {
        for (const n of g[pos].filter(neighbour => canVisit(neighbour, path))) {
            path.push(n);
            walk(path, solutions);
            path.pop();
        }
    }
}

function canVisit(candidate, path) {
    if (candidate === 'start') {
        return false;
    } else if (candidate == candidate.toLowerCase()) { //special handling for small caves
        if (!path.includes(candidate)) 
            return true; //if we've never been here - fine

        //see if we've been twice in a small cave already
        let maxCount = path.filter(it => it == it.toLowerCase())
            .map(it => path.filter(i => i == it).length)
            .reduce((a, b) => Math.max(a, b));

        console.assert(maxCount <= 2, "whoooops");
        return maxCount < 2;
    }
    return true;
}
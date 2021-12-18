function getInput() {
    let text = require('fs').readFileSync('input.txt').toString();
    return text.split("\n");
}

function node(a, b) {
    let node = {
        a: a,
        b: b,
        leaf: false,
    };
    a.parent = node;
    b.parent = node;
    return node;
}

function leaf(val) {
    return {
        val: val,
        leaf: true,
    }
}

class Tokenizer {
    constructor(text) {
        this.text = [...text]; //every thoken is one char
        this.offset = 0;
    }

    next() {
        return this.text[this.offset++];
    }
}

function parseNumber(tokenizer) {
    let t = tokenizer.next();
    if (t === '[') {
        let left = parseNumber(tokenizer);
        if (!tokenizer.next() == ',') console.error("problemo!", tokenizer.offset - 1);
        let right = parseNumber(tokenizer);
        if (!tokenizer.next() == ']') console.error("problemo!", tokenizer.offset - 1);
        return node(left, right);
    } else if (t >= '0' && t <= '9') {
        return leaf(+t);
    }
}

function printCompact(node, d = 0) {
    if (node.leaf) return node.val + '';
    return `[${printCompact(node.a, d + 1)},${printCompact(node.b, d + 1)}]`
}

function addToNeighbour(node, val, from) {
    let other = 'a' == from ? 'b' : 'a';
    let last = node;
    //climb until we can dive into the other direction
    do {
        last = node;
        node = node.parent;
    } while (node !== undefined && node[from] === last);

    if (node) {
        //go down one to the same side we were comiing from
        //we made sure that we dont end up where we came from
        node = node[from];
        //climb down to the most "other-side" element
        while (!node.leaf) {
            node = node[other];
        }
        //sum the value to the target
        node.val += val;
    }
}

//returns true if something exploded
function explode(node, depth) {
    if (!node.leaf) {
        if (depth >= 4) {
            //explode
            addToNeighbour(node, node.a.val, 'a');
            addToNeighbour(node, node.b.val, 'b');
            //turn node into a leaf (haha js is awesome)
            node.val = 0;
            node.leaf = true;
            delete node.a;
            delete node.b;
            return true;
        } else {
            let l = explode(node.a, depth + 1);
            let r = explode(node.b, depth + 1);
            return l || r;
        }
    }
    return false;
}


//performs only 1 split
function split(n) {
    if (n.leaf && n.val >= 10) {
        n.leaf = false;
        n.a = leaf(Math.floor(n.val / 2));
        n.a.parent = n;
        n.b = leaf(Math.ceil(n.val / 2));
        n.b.parent = n;
        delete n.val;
        return true;
    } else if (!n.leaf) {
        return split(n.a) || split(n.b);
    }
    return false;
}

function reduce(n) {
    while (explode(n, 0) || split(n)) {
    }
}

function calculate(stack) {
    stack = stack.map(it => parseNumber(new Tokenizer(it)));
    while (stack.length > 1) {
        let n = node(stack.pop(), stack.pop());
        reduce(n);
        stack.push(n);
    }
    return stack[0];

}

function mag(n) {
    return n.leaf ? n.val : 3 * mag(n.a) + 2 * mag(n.b);
}

console.log("a)")
let result = calculate(getInput().reverse());
console.log(printCompact(result));
console.log(mag(result));

console.log("b)");
let max = -1;
let numbers = getInput();
for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
        if (i !== j) {
            max = Math.max(max, mag(calculate([numbers[i], numbers[j]])));
        }
    }
}
console.log(max);

class Card{
    numbers = [];
    constructor(nums) {
        this.numbers = nums;
    }

    get(x,y) {
        return this.numbers[y][x];
    }

    set(x,y, value) {
        this.numbers[y][x] = value;
    }

    mark(number) {
        for (let y = 0; y < this.numbers.length; y++) {
            for (let x = 0; x < this.numbers[y].length; x++) {
                if (this.get(x,y)== number) {
                    this.set(x,y, undefined)
                }
            }
        }
    }

    hasBingo(){
        //check lines
        for (let y = 0; y < this.numbers.length; y++) {
            let bingo = true;
            for (let x = 0; x < this.numbers[y].length; x++) {
                bingo &= this.get(y,x) == undefined;
            }
            if (bingo) return true;
        }
        //check cols
        for (let x = 0; x < this.numbers[0].length; x++) {
            let bingo = true;
            for (let y = 0; y < this.numbers.length; y++) {
                bingo &= this.get(y,x) == undefined;
            }
            if (bingo) return true;
        }
    }

    score(){
        const sum = (a,b) => a+b;
        return this.numbers.map(it => it.map(a=>a?a:0)
                                        .reduceRight(sum))
                                        .reduceRight(sum);
    }
}


let [numbers, input] = getInput();
let first = false;
for (const n of numbers) {
    input.forEach(i => i.mark(n));
    let toDelete = [];
    for (const c of input) {
        if (c.hasBingo()){
            if (!first){
                console.log("a)", c.score()*n);
                first = true;
            }
            toDelete.push(c);
            if (input.length == 1) {
                console.log("b)", c.score()*n);
            }
        }
    }
    toDelete.forEach(it => input.splice(input.indexOf(it), 1));
}
console.log("end");

function getInput() {
    var fs = require('fs');
    var cards = [];
    var lines = fs.readFileSync('input.txt').toString().split("\n");
    var numbers = lines[0].trim().split(",").map(it => +it);
    var i = 2
    let current_numbers = [];
    for (let i = 2; i < lines.length; i++) {
        const element = lines[i];
        if (element.length == 0) {
            cards.push(new Card(current_numbers));
            current_numbers = [];
        }else{
            const number_line = element.trim().split(/\s+/).map(it => +it);
            current_numbers.push(number_line);
        }
    }
    if (current_numbers.length > 0) {
            cards.push(new Card(current_numbers));
    }

    return [numbers, cards];
}
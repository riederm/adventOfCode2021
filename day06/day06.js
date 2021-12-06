function getInput() {
    var lines = require('fs').readFileSync('input.txt').toString();
    return lines.split(",").map(it => +it);
}

function calculate(days) {
    const day = [0,0,0,0,0,0,0,0,0];
    getInput().forEach(it => day[it]++);
    
    for (let d = 0; d < days; d++) {
        //offspring stays at today
        //move current generation to today+6 --> d+7
        day[(d+7)%9] += day[d%9]; 
    }
    return day.reduceRight((a,b) => a+b);
}
    console.log("a)", calculate(80));
    console.log("b)", calculate(256));

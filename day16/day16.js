const assert = require('assert');

function getInput() {
    let text = require('fs').readFileSync('input.txt').toString();
    // text = 'D2FE28';
    let bitString = text.match(/(.{1,2})/g) //groups of 2 chars
        .map(it => it.length == 2 ? it : it + '0')  //make sure we always have 8 bits
        .map(it => parseInt(it, 16))
        .map(it => it.toString(2).padStart(8, "0")) //keep leading 0 in 8 bit number
        .join("");
    return bitString;
}

class Bits {
    // takes a binary string "1001001110..."
    constructor(bitString) {
        this.bits = bitString;
        this.offset = 0;
    }
 
    //consumes n bits and returns the resulting number
    popNumber(n) {
        let bits = parseInt(this.bits.substring(this.offset, this.offset + n), 2);
        this.offset += n;
        return bits;
    }

    //consumes n bits and returns them as a bit-string
    popBits(n) {
        let bits = this.bits.substring(this.offset, this.offset + n);
        this.offset += n;
        return bits;
    }
}

let version_sum = 0;
let result = parse_package(new Bits(getInput()));

console.log("a)", version_sum);
console.log("b)", result);
assert(result == 180616437720);

function parse_package(bits) {
    version_sum += bits.popNumber(3); //eat version
    let packet_type = bits.popNumber(3);
    if (packet_type == 4) {
        //Literal
        let bitString = '';
        let hasMore = false;
        do {
            hasMore = bits.popNumber(1);
            bitString += bits.popBits(4);
        } while (hasMore);
        return parseInt(bitString, 2);
    } else {
        //Operation
        let len_type_id = bits.popNumber(1);
        let operands = [];
        if (len_type_id == 0) {
            // total length of all operands
            let numBits = bits.popNumber(15);
            let start_offset = bits.offset;
            while (bits.offset < start_offset + numBits) {
                operands.push(parse_package(bits));
            }
        } else {
            //number of operand-packages
            let num = bits.popNumber(11);
            for (let i = 0; i < num; i++) {
                operands.push(parse_package(bits));
            }
        }
        return calculate(packet_type, operands);
    }
}

function calculate(operator, operands) {
    switch (operator) {
        case 0: return operands.reduce((a, b) => a + b); //SUM
        case 1: return operands.reduce((a, b) => a * b, 1); //PRODUCT
        case 2: return Math.min(...operands); //MIN
        case 3: return Math.max(...operands); //MAX
        case 5: return operands[0] > operands[1] ? 1 : 0; //GREATER
        case 6: return operands[0] < operands[1] ? 1 : 0; //LESS
        case 7: return operands[0] == operands[1] ? 1 : 0; //EQUAL
        default: console.log("unknown operator", operator);
    };
}
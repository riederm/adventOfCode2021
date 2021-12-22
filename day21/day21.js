
class Die {
    val = 0;

    next() {
        this.val = this.val == 100 ? 1 : this.val+1;
        console.log(this.val);
        return this.val;
    }
}

let p1 = {
    pos: 1,
    points: 0
};

let p2 = {
    pos: 5,
    points: 0
};

let n = 0;
let die = new Die();
while(p1.points < 1000 && p2.points < 1000) {
    let player = (n%2 == 0) ? p1 : p2;
    player.pos += die.next() + die.next() + die.next();
    while(player.pos > 10) player.pos -= 10;
    player.points += player.pos;
    n++;
    console.log(p1, p2);
}

console.log(n, p1, p2);

let loser = p1.points >= 1000 ? p2 : p1;
console.log(loser.points, "*", n*3, "=", loser.points * n*3);



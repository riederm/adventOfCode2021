const { runInNewContext } = require("vm");

class Die {
    val = 0;

    next() {
        this.val = this.val == 100 ? 1 : this.val+1;
        return this.val;
    }

    roll3(){
        return this.next()+this.next()+this.next();
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
    player.pos += die.roll3();
    while(player.pos > 10) player.pos -= 10;
    player.points += player.pos;
    n++;
}

console.log(n, p1, p2);

let loser = p1.points >= 1000 ? p2 : p1;
console.log(loser.points, "*", n*3, "=", loser.points * n*3);

function player(index, pos, points){
    return {
        index: index,
        pos: pos,
        points: points
    };
}

const players_select = [0,0,0,1,1,1];
const other_select = [1,1,1,0,0,0];
const dirac_die = [1,2,3];
let memory = [];
play([player(0, 4, 0), player(1, 8, 0)], 0, 0);

function play(players, lvl, n) {
    
    let current_player_index = players_select[n % players_select.length];
    let current_player = players[current_player_index];
    let other_player = players[other_select[n % other_select.length]];

    if (n % 3 == 0){
        //calculate points for other player
        while(other_player.pos > 10) other_player.pos -= 10;
        other_player.points += other_player.pos;
        
        if (other_player.points >= 21){
            let wins = [0,0];
            wins[other_player.index] = 1;
            return wins;
        }
    }

    let level_wins = [0, 0];

    if (!memory[lvl]){
        for (let t = 0; t < dirac_die.length; t++) {
            current_player.pos += dirac_die[t];
            let branch_wins = play(players, lvl+1, n+1);
            current_player.pos -= dirac_die[t];

            level_wins[0] += branch_wins[0];
            level_wins[1] += branch_wins[1];
        }
        //keep track of this level
        memory[lvl] = [...level_wins];
    }else{
        level_wins = memory[lvl];
    }
    
    return level_wins;
}



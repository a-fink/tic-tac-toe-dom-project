// import { Player } from './player';
const Player = require('./player')

class Computer extends Player{
    constructor(symbol){
        super(symbol);
        this.opponentSymbol = this.swapSymbol(symbol);
    }



}

const computer = new Computer('o');

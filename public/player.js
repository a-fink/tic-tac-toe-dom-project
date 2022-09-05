import { TTT } from './ttt.js';

export class Player extends TTT{
    constructor(symbol){
        super();
        this.symbol = symbol;
    }

    // place own symbol in own grid at given location
    placeOwn(row, col){
        this.place(row, col, this.symbol);
    }

    // place opponent sysmbol in own grid at given location
    placeOpponent(row, col){
        const opponentSymbol = this.swapSymbol(this.symbol);
        this.place(row, col, opponentSymbol);
    }

    // overwrite checkwin method - call super's checkwin with own grid & symbol
    checkWin(){
        return super.checkWin(this.grid, this.symbol);
    }

    // check whether opponent has won - call super's checkwin with own grid and opponent's symbol
    checkOpponentWin(){
        const opponentSymbol = this.swapSymbol(this.symbol);
        return super.checkWin(this.grid, opponentSymbol);
    }

    // check whether the game is a tie
    isTie(){
        // if there are no moves left, and neither self or opponent have won, then it's a tie
        if(!this.movesRemain() && !this.checkWin() && !this.checkOpponentWin()) return true;
        return false;
    }
}

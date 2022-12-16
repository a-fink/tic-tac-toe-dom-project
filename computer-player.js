import { Player } from './player.js';

export class Computer extends Player{
    constructor(symbol){
        super(symbol);
        this.opponentSymbol = this.swapSymbol(symbol);
    }

    // method to undo a move - set a row col position back to ' '
    // for use in checking for wins/blocks
    undoMove(row, col){
        this.grid[row][col] = ' ';
    }

    // generate a move and return and array of [row, col]
    generateMove(){
        // generate the valid moves left
        const moves = this.getValidMoves();

        // should never hit this but just in case - if moves has no entries return null
        if(moves.length === 0) return null;

        // check if a winning move exists by calling winningMoves with own symbol
        // if any are found use the 1st
        const winningMoves = this.getWinningMoves(moves);
        if(winningMoves.length > 0) return winningMoves[0];

        // check if a blocking move exists by calling winningMoves with opponent's symbol
        // if any are found use the 1st
        const blockingMoves = this.getBlockingMoves(moves);
        if(blockingMoves.length > 0) return blockingMoves[0];

        // otherwise
        return this.getRandomMove(moves);
    }

    // check grid and return a 2D array holding [row, col] pairs for all spaces still holding ' '
    getValidMoves(){
        const moves = [];
        const rows = this.grid.length;
        const cols = this.grid[0].length;

        for(let row = 0; row < rows; row++){
            for(let col = 0; col < cols; col++){
                if(this.grid[row][col] === ' '){
                    moves.push([row, col]);
                }
            }
        }

        return moves;
    }

    // take in 2D array of valid moves & return 2D array holding the [row, col] pairs for all that would cause a win condition
    getWinningMoves(moves){
        const winningMoves = [];

        for(let i = 0; i < moves.length; i++){
            const move = moves[i];

            // put own symbol in at the given position
            this.placeOwn(move[0], move[1]);

            // if it creates a win for self add it to the winning moves list
            if(this.checkWin()) winningMoves.push(move);

            // undo the move to get board back to previous state
            this.undoMove(move[0], move[1]);
        }

        return winningMoves;
    }

    // take in 2D array of valid moves & return 2D array holding the [row, col] pairs that would cause an opponent win
    getBlockingMoves(moves){
        const blockingMoves = [];

        for(let i = 0; i < moves.length; i++){
            const move = moves[i];

            // put opponent symbol in at the given position
            this.placeOpponent(move[0], move[1]);

            // if it creates a win for the opponent add it to the winning moves list
            if(this.checkOpponentWin()) blockingMoves.push(move);

            // undo the move to get board back to previous state
            this.undoMove(move[0], move[1]);
        }

        return blockingMoves;
    }


    // take in a 2D array of valid moves, choose one randomly and return it
    getRandomMove(moves){
        const min = 0;
        const max = moves.length - 1;
        const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);

        return moves[randomIndex];
    }
}

class TTT {
    constructor(){
        this.grid = [[' ',' ',' '],
                     [' ',' ',' '],
                     [' ',' ',' ']];
    }

    // place given symbol into the grid
    // this will only ever be called on the frontend when the space is a valid move
    place(row, col, symbol){
        this.grid[row][col] = symbol;
    }

    // give classes that extend TTT an easy way to get their opponents symbol if know own
    swapSymbol(symbol){
        if(symbol === 'x') return 'o';
        if(symbol === 'o') return 'x';
    }

    // check for wins given a grid and a symbol - return true or false if they have won
    checkWin(grid, symbol){
        // call helper to see if there's a horizontal win
        const horiz = TTT.checkHorizWins(grid, symbol);
        // call helper to see if there's a vertical win
        const vert = TTT.checkVertWins(grid, symbol);
        // call helper to see if there's a diagonal win
        const diag = TTT.checkDiagwins(grid, symbol);

        // if any of the above functions return true then the given symbol has won - return true
        if(horiz || vert || diag) return true;

        // otherwise return false
        return false;
    }

    // check for whether any moves remain (any spot in grid is still ' ')
    movesRemain(){
        const rows = this.grid.length;
        const cols = this.grid[0].length;

        for(let row = 0; row < rows; row++){
            for(let col = 0; col < cols; col++){
                // if current position contains a space return true
                if(this.grid[row][col] === ' ') return true;
            }
        }

        // if no empty spaces were found return false
        return false;
    }

    // helper to check if there's a horizontal win
    static checkHorizWins(grid, symbol){
        // for each row in the grid call the helper function to check if that row has a win
        for(let i = 0; i < grid.length; i++){
            // if the helper finds a win, return true
            if(this.checkSingleArray(grid[i], symbol)) return true;
        }

        // if none of the rows had a win return false
        return false;
    }

    // helper to check vertical wins
    static checkVertWins(grid, symbol){
        const rows = grid.length;
        const cols = grid[0].length;

        // for each column, generate array of column values
        for(let col = 0; col < cols; col++){
            const columnToCheck = [];
            for(let row = 0; row < rows; row++){
                columnToCheck.push(grid[row][col]);
            }
            // call the helper function to check if generated column has a win
            // if helper finds a win return true
            if(this.checkSingleArray(columnToCheck, symbol)) return true;
        }

        // if none of the columns had a win return false
        return false;
    }

    // helper to check for diagonal wins
    static checkDiagwins(grid, symbol){
        const rows = grid.length;
        const cols = grid[0].length;

        let row = 0;
        let col = 0;

        // generate array for top left to bottom right diagonal
        const firstDiagonal = [];
        while(row < rows && col < cols){
            firstDiagonal.push(grid[row][col]);
            row++;
            col++;
        }

        // generate array of bottom left to top right diagonal
        row = rows-1;
        col = 0;
        const secondDiagonal = [];
        while(row >= 0 && col < cols){
            secondDiagonal.push(grid[row][col]);
            row--;
            col++;
        }

        // if helper returns a win for either diagonal return true
        if(this.checkSingleArray(firstDiagonal, symbol) || this.checkSingleArray(secondDiagonal, symbol)) return true;

        // otherwise return false
        return false;
    }

    // helper to check a single direction array pulled from the grid
    static checkSingleArray(array, symbol){
        // go through the array, if any index has something other than symbol return false
        for(let i = 0; i < array.length; i++){
            if(array[i] !== symbol) return false;
        }

        // if make it here then all matched symbol, return true
        return true;
    }
}

module.exports = TTT;

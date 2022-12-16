import {Player} from './player.js';
import {Computer} from './computer-player.js';

let playerTurn, player, computer;

// once the dom is loaded set up everything else
window.addEventListener('DOMContentLoaded', event => {
    // set up the players objects, the player turn, and the board html/css
    setUpPlayers();
    setUpBoard();

    // add listeners to the ul and both buttons
    addListeners();

    // disable the newGame button (give up will start in the default enabled state)
    // in lines below, if game gets restored to one with a winner it will handle swapping this
    disableNewGame();

    // check whether session storage has data (getting doesn't return null)
    // all values in session storage set by one function, so if one exists all should exist
    // if session storage has data, restore the game state
    if(sessionStorage.getItem('player-symbol')){
        // console.log('restoring game');
        restoreGameState();
    }

    // otherwise log that we're starting a new game and store the game state in session storage
    else{
        // console.log('starting new game');
        storeGameState();
    }

    // log the symbols and player turn to the console for debugging purposes
    // console.log(`player is ${player.symbol}, computer is ${computer.symbol}, playerTurn is ${playerTurn}`);

    // if it's the computer's turn (playerTurn set to false) then make computer take a turn
    if(playerTurn === false) doComputerTurn();
});

// store state of player's board, player's symbol, the current winner, and whether it is the player's turn in session storage
// this method should be called once game initialized and after every move
function storeGameState(){
    sessionStorage.setItem('board', JSON.stringify(player.grid));
    sessionStorage.setItem('player-turn', JSON.stringify(playerTurn));
    sessionStorage.setItem('player-symbol', JSON.stringify(player.symbol));

    // get the text of the winner span
    const winnerSpanText = document.getElementById('winner-span').innerText;
    sessionStorage.setItem('winner', winnerSpanText);
}


// will only be called once DOMConsoleLoaded event triggers and has already checked that game state data exists
function restoreGameState(){
    // get data from session storage and parse it out of JSON format
    const board = JSON.parse(sessionStorage.getItem('board'));
    const turn = JSON.parse(sessionStorage.getItem('player-turn'));
    const playerSymbol = JSON.parse(sessionStorage.getItem('player-symbol'));

    // set player and computer board states to board
    player.grid = board;
    computer.grid = board;

    // set whether it is the player's turn
    playerTurn = turn;

    // set player & computer symbols
    player.symbol = playerSymbol;
    computer.symbol = player.swapSymbol(player.symbol)

    // restore game board in the html/css
    restoreGameBoardUI();

    // restore the winner state
    restoreWinnerState();
}

// used to restore the html/css for the board once player's grid has been restored
function restoreGameBoardUI(){
    // go through the player's board and set corresponding li elements to the right classes
    const rows = player.grid.length;
    const cols = player.grid[0].length;

    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            // get corresponding li element
            const li = document.getElementById(`cell-${row}-${col}`);

            // get the value of the space in the game board
            const value = player.grid[row][col];

            // if the value is not a space, remove the hover class & set the correct image class
            if(value !== ' '){
                li.classList.remove('hover');
                li.classList.add(value);
            }
        }
    }
}

function restoreWinnerState(){
    // get the winner text from the session storage
    // if it's an empty string there is currently no winner and the board should remain in the ongoing game state (do nothing)
    // if it's not an empty string there's a winner - call the handle winner function with the string to set the proper winner game state
    const winnerString = sessionStorage.getItem('winner');
    if(winnerString !== ''){
        handleWinner(winnerString);
    }
}

// make new instances of the player/computer & set the turn variable
function setUpPlayers(){
    // make player & computer & randomly assign who is 'x'
    player = new Player(generateSymbol());
    computer = new Computer(player.swapSymbol(player.symbol));

    // based on who got the x set a boolean for whether it is the player's turn
    if(player.symbol === 'x') playerTurn = true;
    else playerTurn = false;
}

// generate a random symbol either x or o
function generateSymbol(){
    const symbols = ['x', 'o'];
    const min = 0;
    const max = symbols.length - 1;
    const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);

    return symbols[randomIndex];
}

// set up the li elements for the game board
function setUpBoard(){
    // get the ul element
    const ul = document.getElementById('game-board');

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            const li = document.createElement('li');

            // all li get a class of grid-square and hover, and an id with their position
            li.setAttribute('class', 'grid-square');
            li.classList.add('hover');
            li.setAttribute('id', `cell-${i}-${j}`);

            // append final li into the ul
            ul.append(li);
        }
    }
}

// add listeners to the ul and the buttons
function addListeners(){
    // get the ul and the 2 buttons
    const ul = document.getElementById('game-board');
    const newGameButton = document.getElementById('new-game');
    const giveUpButton = document.getElementById('give-up');

    ul.addEventListener('click', handleSpaceClick);
    newGameButton.addEventListener('click', newGameHandler);
    giveUpButton.addEventListener('click', giveUpHandler);
}

// handler for when player clicks on board space li/ul
function handleSpaceClick(event){
    const target = event.target;
    const clickLocation = target.id;

    // if the click location was an li (not the board iteslf)
    // and if the specified li is still interactable (has class hover)
    // and if it is the player's turn
    if(clickLocation !== 'game-board' && target.classList.contains('hover') && playerTurn){
        // get the row and col from the clickLocation string
        const row = clickLocation.split('-')[1];
        const col = clickLocation.split('-')[2];

        // update the player and computer game boards
        player.placeOwn(row, col);
        computer.placeOpponent(row, col);

        // remove the hover class & add the player's symbol as a class on the li
        target.classList.remove('hover');
        target.classList.add(`${player.symbol}`);

        // if the move created a win for the player call the winner handler with player's symbol
        if(player.checkWin()) handleWinner(player.symbol.toUpperCase());

        // if the move created a tie, call the winner handler with a winner of null
        else if(player.isTie()) handleWinner('None');

        // if neither win or tie reached then swap the player turn, update the values in sessionStorage, and tell computer to go
        else{
            playerTurn = false;
            storeGameState();
            doComputerTurn();
        }
    }
}

// handle giveUpButton click (will only trigger when giveUp button is enabled)
function giveUpHandler(event){
    // if player clicks give up then computer wins - call winner function with computer symbol
    // it will handle the other changes needed (player turn, hovers, disabling/enabling buttons)
    handleWinner(computer.symbol);
    // console.log('give up clicked');
}

// handle newGameButton click (will only trigger when newGame button is enabled)
function newGameHandler(event){
    // console.log('new game clicked');

    // disable the new game button
    disableNewGame();

    // to start a new game clear/reset all of the board spaces
    resetBoardSpaces();

    // clear the winner from the header
    clearWinnerSpan();

    // set up new player/computer instances
    setUpPlayers();

    // update the game state in the session storage once everything is rebuilt
    storeGameState();

    // log the symbols and player turn to the console for debugging purposes
    // console.log(`player is ${player.symbol}, computer is ${computer.symbol}, playerTurn is ${playerTurn}`);

    // re-enable the give up button
    enableGiveUp();

    // if it's the computer's turn first (when comptuer is x) then make computer take a turn
    if(!playerTurn) doComputerTurn();
}

// call to make computer turn happen and update all accordingly
function doComputerTurn(){
    // tell the computer to generate a move
    const move = computer.generateMove();
    const row = move[0];
    const col = move[1];

    // update the computer and player game boards
    computer.placeOwn(row, col);
    player.placeOpponent(row, col);

    // get the corresponding li for the move
    // then remove the hover class & add the player's symbol as a class on the li
    const id = `cell-${row}-${col}`;
    const li = document.getElementById(id);
    li.classList.remove('hover');
    li.classList.add(`${computer.symbol}`);

    // if the move created a win for the computer call the winner handler with computer's symbol
    if(computer.checkWin()) handleWinner(computer.symbol.toUpperCase());

    // if the move created a tie, call the winner handler with a winner of none
    else if(computer.isTie()) handleWinner('None');

    // if neither win or tie reached then swap back to player turn and wait for next player click
    else{
        playerTurn = true;
        storeGameState();
    }
}

// handle all end of game logic after winner/tie is found
// if player clicked give up will also get their symbol
function handleWinner(winner){
    // once winner or give up happens set player turn to null so that the listener on the ul will ignore all clicks
    playerTurn = null;

    // update the winner span in the heading to the player that won
    setWinnerSpan(winner);

    // update the game state in session storage
    storeGameState();

    // clear all hovers on the li elements to indicate not interactable
    clearAllHovers();

    // disable the give up button and enable the new game button
    disableGiveUp();
    enableNewGame();
}

// enable the give up button (make clickable and able to have events)
function enableGiveUp(){
    const giveUpButton = document.getElementById('give-up');
    giveUpButton.disabled = false;
    // console.log('give up enabled');
}

// disable the give up button (when disabled will not generate events)
function disableGiveUp(){
    const giveUpButton = document.getElementById('give-up');
    giveUpButton.disabled = true;
    // console.log('give up disabled');
}

// enable the new game button (make clickable and able to have events)
function enableNewGame(){
    const newGameButton = document.getElementById('new-game');
    newGameButton.disabled = false;
    // console.log('new game enabled');
}

// diable the new game button (when disabled will not generate events)
function disableNewGame(){
    const newGameButton = document.getElementById('new-game');
    newGameButton.disabled = true;
    // console.log('new game disabled');
}

// set the winner when win/tie is found
function setWinnerSpan(string){
    // get the winner span element & set it's inner text to given string
    const span = document.getElementById('winner-span');
    span.innerText = string;
}

// clear the winner for new games
function clearWinnerSpan(){
    // get the winner span element & set it's inner text to empty string
    const span = document.getElementById('winner-span');
    span.innerText = "";
}

// remove the hover class from all li elements that have it - for win/tie/give-up states
function clearAllHovers(){
    // get the array of all li elements by their shared class
    const liArray = document.querySelectorAll('.grid-square');

    // go through the array and remove the hover class from any element that has it
    for(let i = 0; i < liArray.length; i++){
        const li = liArray[i];
        if(li.classList.contains('hover')) li.classList.remove('hover');
    }
}

// remove all image classes from lis and put hover back on all
function resetBoardSpaces(){
    // get the array of all li elements by their shared class
    const liArray = document.querySelectorAll('.grid-square');

    // go through the array and remove x & o classes if there, add hover to all
    for(let i = 0; i < liArray.length; i++){
        const li = liArray[i];
        if(li.classList.contains('x')) li.classList.remove('x');
        if(li.classList.contains('o')) li.classList.remove('o');
        li.classList.add('hover');
    }
}

// debugger;

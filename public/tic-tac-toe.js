import {Player} from './additional-js/player';
import {Computer} from './additional-js/computer-player';

// Your code here
// once the dom is loaded set up everything else
window.addEventListener('DOMContentLoaded', event => {
    setUpBoard();
    addListeners();
});

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

function handleSpaceClick(event){
    const target = event.target;
    const clickLocation = target.id;

    // if the click location was an li (not the board iteslf)
    // and if the specified li is still interactable (has class hover)
    if(clickLocation !== 'game-board' && target.classList.contains('hover')){
        // FILL IN HERE
        console.log(clickLocation);
    }
}

function newGameHandler(){

}

function giveUpHandler(){

}

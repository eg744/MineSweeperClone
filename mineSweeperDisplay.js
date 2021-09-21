//Display minesweeper UI 

const BOARD_SIZE = 4;
const NUM_OF_MINES = 4;

import { 
    TILE_STATUS,
    createBoard, 
    markTile, 
    revealTile,
    checkWin,
    checkLoss
} from "./mineSweeperLogic.js";

const board = createBoard(BOARD_SIZE, NUM_OF_MINES);
const boardElement = document.querySelector(".board");

const minesRemainingText = document.querySelector("[data-mineNumber]");
const gameStatusText = document.querySelector(".subtext");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameConclusion();
        });
        //right click eventlistener
        tile.element.addEventListener("contextmenu", e => {
            //prevent contextmenu
            e.preventDefault();
            markTile(tile);
            updateMinesLeft();
        });
    })
})

//set size element to display grid 
boardElement.style.setProperty('--size', BOARD_SIZE);
//display possible mines left in <span>
minesRemainingText.textContent = NUM_OF_MINES;

function updateMinesLeft(){
    const markedTilesCount = board.reduce((count, row) => {
        //returns number of tiles marked 
        return count + row.filter(tile => tile.status === TILE_STATUS.MARKED).length;
    }, 0);  //0 default value 

    //set text to new value 
    minesRemainingText.textContent = NUM_OF_MINES - markedTilesCount;
}

function checkGameConclusion(){
    const win = checkWin();
    const lose = checkLoss();

    //stop future event listeners if game is over 
    if(win || lose){
        boardElement.addEventListener("click", stopBoardProp, {capture: true});
        boardElement.addEventListener("contextmenu", stopBoardProp, {capture: true});
    }

    if(win){
        gameStatusText.textContent = "You Win!";
    }
    if(lose){
        gameStatusText.textContent = "You Lose!";
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUS.MARKED) markTile(tile);
                if(tile.mine) revealTile(board,tile); 
            })
        })
    }
}

function stopBoardProp(board){
    board.stopImmediatePropagation();
}

// populate board empty tiles/mines
// left click tiles
    // a. reveal tiles
// right click tiles
        // a. mark tiles
// check for win/loss


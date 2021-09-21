//Minesweeper Logic 

export const TILE_STATUS = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number", 
    MARKED: "marked"
}

export function createBoard(boardSize, numberOfMines){

    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);
    //console.log(minePositions);

    for(let x = 0; x < boardSize; x++){
        const row = [];
        for(let y = 0; y < boardSize; y++){
            //create new div for each element
            const element = document.createElement("div");
            //set status to hidden by default 
            element.dataset.status = TILE_STATUS.HIDDEN;
            const tile = {
                element,
                x,
                y, 
                //sets current tile to mine if it matches any generated mine coordinates
                mine: minePositions.some(positionMatches.bind(null, {x, y})), 

                //binds on object property to function when property is looked up
                get status(){
                    return this.element.dataset.status; 
                },

                //call status() when specified property is attempting to change
                set status(value) {
                    this.element.dataset.status = value; 
                }
            };
            row.push(tile);
        }
        board.push(row);
    }
    return board;
}

export function checkLoss(board){
    
}

export function checkWin(board){
    
}

function getMinePositions(boardSize, numberOfMines){
    //Array of positions of current mines
    const positions = [];
    

    //using while less than numberofmines. for may assign multiple mines to same position
    while(positions.length < numberOfMines){
        const position = {
            x: randomNumber(boardSize) ,
            y: randomNumber(boardSize)
        }
        //check if this position already exists against positionmatches. p = current position.
        //if(!positions.some( p => positionMatches(p, position))){
            //bind() this 
        if(!positions.some(positionMatches.bind(null, position))){
            positions.push(position);
        } 
    }
    return positions; 
}

//return true if a position already exists 
function positionMatches(pos1, pos2){
    return pos1.x === pos2.x && pos1.y === pos2.y; 
}
//create a random number for x and y values 
function randomNumber(size){
    return Math.floor(Math.random() * size);
}

export function markTile(tile){
    if(tile.status !== TILE_STATUS.HIDDEN && tile.status !== TILE_STATUS.MARKED){
        return;
    }
    if(tile.status === TILE_STATUS.MARKED){
        tile.status = TILE_STATUS.HIDDEN;
    }else{
        tile.status = TILE_STATUS.MARKED;
    }
}

//change status after click 
export function revealTile(board, tile){
    if( tile.status !== TILE_STATUS.HIDDEN){
        return;
    }
    if( tile.mine){ 
        tile.status = TILE_STATUS.MINE;
        return;
    }

    tile.status = TILE_STATUS.NUMBER;
    //Array of tiles adjacent to selected tile 
    const tilesAdjacent = surroundingTiles(board, tile);

    //Array of mines adjacent to selected tile 
    const minesAdjacent = tilesAdjacent.filter(tile => tile.mine);
    
    if(minesAdjacent.length === 0){

        //if no adjacent mines, recursively reveal adjacent tiles until tiles are adjacent to a mine
        tilesAdjacent.forEach(revealTile.bind(null, board));
    }else{
        tile.element.textContent = minesAdjacent.length;
    }
}

function surroundingTiles(board, {x, y}){
    const tiles = [];
    
    for(let xOffset = -1; xOffset <= 1; xOffset++){
        for(let yOffset = -1; yOffset <= 1; yOffset++){
            
            //if xOffset not undefined, relate to the yOffset 
            const tile = board[x + xOffset]?.[y + yOffset];
            if(tile){
                tiles.push(tile);
            }
        }
    }
    return tiles;
}


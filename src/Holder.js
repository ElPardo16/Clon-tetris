const ROWS = 20
const COLS = 13
const CELL_EDGE = 30
const CANVAS = document.getElementById("display")
var lastDelta = 1000
var deltaTime = 700
var playing = true

let board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)
//board.printc();
board.drawMatriz()
//board.drawForm()
let figureM = new Figuras().tetrominoRandom();

board.refresh(figureM)
//board.moveDown()
function m(){
    board.moveDown()
    //board.drawMatriz()
}
function r(){
    board.rotate()
    //board.drawMatriz()
}
function ri(){
    board.moveRight()
    //board.drawMatriz()
}
function le(){
    board.moveLeft()
    //board.drawMatriz()
}
document.addEventListener("keydown", e =>{
    //console.log(e.key)
    switch(e.key){
        case "ArrowDown":
            m()
            break
        case "ArrowRight":
            ri()
            break
        case "ArrowLeft":
            le()
            break
        case "ArrowUp":
            r()
            break
        case "q":
            stop()
            break;
        case "p":
            pause()
            break;
    }
})


    var gameloop = setInterval(() => {
        board.moveDown()
    },deltaTime)


function pause(){
    playing = !playing
    if(playing){
        var gameloop = setInterval(() => {
            board.moveDown()
        },deltaTime)
        //deltaTime = lastDelta
    }else{
        stop()
    }
}
function stop(){
    clearInterval(gameloop)
}
/* setInterval(() => {board.moveDown()
board.drawMatriz()}, 200) */
//board.rotate()
/* setInterval(() => {board.rotate()
    board.drawMatriz()}, 1000)
//board.rotate()
setInterval(() => {board.rotate()
    board.drawMatriz()}, 1000)
//board.rotate()
setInterval(() => {board.rotate()
    board.drawMatriz()}, 1000)
//board.rotate()
console.table(board.grid) */
//board.drawMatriz()

/* board.moveDown()
board.moveDown() */
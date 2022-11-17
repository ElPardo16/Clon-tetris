const ROWS = 20
const COLS = 13
const CELL_EDGE = 30
const CANVAS = document.getElementById("display")
const C_NEXT = document.getElementById("d-proxima")
var lastDelta = 1000
var deltaTime = 700
var playing = true

let board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)
let netxF = new Board(C_NEXT,4,4,30)
//board.printc();
board.drawMatriz()
netxF.drawMatriz()
//board.drawForm()
let figureM = new Figuras().tetrominoRandom();

board.refresh(figureM)
//board.moveDown()
function moveD(){
    board.moveDown()
    //board.drawMatriz()
}
function rotateF(){
    board.rotate()
    //board.drawMatriz()
}
function moveRi(){
    board.moveRight()
    //board.drawMatriz()
}
function moveLe(){
    board.moveLeft()
    //board.drawMatriz()
}
document.addEventListener("keydown", e =>{
    //console.log(e.key)
    switch(e.key){
        case "ArrowDown":
            moveD()
            break
        case "ArrowRight":
            moveRi()
            break
        case "ArrowLeft":
            moveLe()
            break
        case "ArrowUp":
            rotateF()
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

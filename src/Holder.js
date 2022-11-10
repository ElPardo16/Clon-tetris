const BOARD_SIZE = 25
const CELL_EDGE = 40
const CANVAS = document.getElementById("display")

let board = new Board(CANVAS,BOARD_SIZE, CELL_EDGE)
//board.printc();
//board.drawBackground()
//board.drawForm()
let t = [
    [0,0,0],
    [0,1,0],
    [1,1,1]
]
board.refresh(t)
//board.moveDown()
function m(){
    board.moveDown()
    //board.drawMatriz()
}
function r(){
    board.rotate()
    //board.drawMatriz()
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
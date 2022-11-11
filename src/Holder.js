const ROWS = 20
const COLS = 13
const CELL_EDGE = 30
const CANVAS = document.getElementById("display")

let board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)
//board.printc();
board.drawMatriz()
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
function ri(){
    board.moveRight()
    //board.drawMatriz()
}
function le(){
    board.moveLeft()
    //board.drawMatriz()
}
document.addEventListener("keydown", e =>{

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
    }
})
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
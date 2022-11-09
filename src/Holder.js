const BOARD_SIZE = 25
const CELL_EDGE = 40
const CANVAS = document.getElementById("display")

let board = new Board(CANVAS,BOARD_SIZE, CELL_EDGE)
board.printc();
board.drawBackground()
board.drawForm()
let t = [
    [0,0,0],
    [0,1,0],
    [1,1,1]
]
board.refresh(t)
board.moveDown()
board.rotate()
board.rotate()
board.rotate()
board.rotate()
/* board.moveDown()
board.moveDown() */
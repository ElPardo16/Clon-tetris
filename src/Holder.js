const BOARD_SIZE = 25
const CELL_EDGE = 40
const CANVAS = document.getElementById("display")

let board = new Board(CANVAS,BOARD_SIZE, CELL_EDGE)
board.printc();
board.drawBackground()
board.drawForm()
board.refresh()
board.moveDown()
/* board.moveDown()
board.moveDown() */
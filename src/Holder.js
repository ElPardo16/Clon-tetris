const ROWS = 20
const COLS = 13
const CELL_EDGE = 30
const CANVAS = document.getElementById("display")
const C_NEXT = document.getElementById("d-proxima")
const BTN_PLAY = document.getElementById("play")
var deltaTime = 700
var playing = true
var levelScore = 0

let board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)
let nextF = new Board(C_NEXT,4,4,CELL_EDGE / 2)
//board.printc();
board.drawMatriz()
nextF.drawMatriz()
var gameloop = undefined
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
    if(!board.endGame){
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
    }
})


   


function pause(){
    playing = !playing
    if(playing){
        stop()
        gameloop = setInterval(() => {
            if(!board.endGame){
                board.moveDown()
                nextF.clearBoard()
                nextF.refresh(board.nextF)
                moreLevel()
            }else{
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.documentElement.style.setProperty("--btn-p","flex")
                    document.documentElement.style.setProperty("--btn-m","none")
                }else{
                    BTN_PLAY.classList.remove("disable")
                }
                stop()
            }
        },deltaTime)
        //deltaTime = lastDelta
    }else{
        stop()
    }
}
function stop(){
    clearInterval(gameloop)
}
function moreLevel(){

    if(board.scoreLevel >= 500){
        board.scoreLevel = 0
        board.level++
        board.levelTxt.textContent = board.level
        deltaTime -= 50
        stop()
        gameloop = setInterval(() => {
            if(!board.endGame){
                board.moveDown()
                nextF.clearBoard()
                nextF.refresh(board.nextF)
                moreLevel()
            }else{
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.documentElement.style.setProperty("--btn-p","flex")
                    document.documentElement.style.setProperty("--btn-m","none")
                }else{
                    BTN_PLAY.classList.remove("disable")
                }
                stop()
            }
        },deltaTime)
    }
}
function playGame(){
    board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)
    nextF = new Board(C_NEXT,4,4,CELL_EDGE / 2)
    board.levelTxt.textContent = board.level
    board.drawMatriz()
    nextF.drawMatriz()
    //board.drawForm()
    let figureM = new Figuras().tetrominoRandom();
    board.nextF = figureM
    if(playing){
        board.refresh(figureM)
        nextF.refresh(board.nextF)
        gameloop = setInterval(() => {
            if(!board.endGame){
                board.moveDown()
                nextF.clearBoard()
                nextF.refresh(board.nextF)
                moreLevel()
            }else{
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.documentElement.style.setProperty("--btn-p","flex")
                    document.documentElement.style.setProperty("--btn-m","none")
                }else{
                    BTN_PLAY.classList.remove("disable")
                }
                stop()
            }
        },deltaTime)
    }
    
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        document.documentElement.style.setProperty("--btn-m","grid")
        document.documentElement.style.setProperty("--btn-p","none")
    }else{
        BTN_PLAY.classList.add("disable")
    }
}

//console.log(Board.endGame)

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

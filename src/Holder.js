//Declaración e inicialización de variables y constantes

const ROWS = 20 //Filas del tablero
const COLS = 13 //Columnas del tablero
const CELL_EDGE = 30 //Tamaño de las celdas del tablero 
//Elementos traídos del DOM mediante el método 'getElementById' a través del valor del atributo id asignado
const CANVAS = document.getElementById("display") //Canva del tetris
const C_NEXT = document.getElementById("d-proxima") //Canva de tetromino siguiente
const BTN_PLAY = document.getElementById("play") //Botón de play
var deltaTime = 700 //Intervalo de tiempo de desplazamiento
var playing = true //Variable booleana
var levelScore = 0 //Variable del nivel del juego

//Instanciación de la clase Board (script Board) para la creación del tablero del tetris
let board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)

//Estructura de control doble en la cual se determina el tamaño de la celda del tablero de la minipieza conforme se detecte con la propiedad navigator.UserAgent si el dispositivo es móvil o no
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //Instanciación de la clase Board para creación del tablero de la minipieza (tetromino siguiente)
    nextF = new Board(C_NEXT,4,5,CELL_EDGE / 2)
}else{
    nextF = new Board(C_NEXT,4,5,CELL_EDGE)
}

board.drawMatriz()//Llamado al método para dibujar matriz del tablero de tetris
nextF.drawMatriz()//Llamado al método para dibujar matriz del tablero del tetromino siguiente
var gameloop = undefined

//Funciones a las cuales se les asocian los métodos de movimiento de las figuras, provenientes de la clase Board al objeto recientemente instanciado (board-tablero del tetris)
function moveD(){
    board.moveDown()//Método desplazamiento descendente
    //board.drawMatriz()
}
function rotateF(){
    board.rotate()//Método rotación de la figura
    //board.drawMatriz()
}
function moveRi(){
    board.moveRight()//Método desplazamiento hacia la derecha
    //board.drawMatriz()
}
function moveLe(){
    board.moveLeft()//Método desplazamiento hacia la izquierda
    //board.drawMatriz()
}
/*Detección de eventos de teclado, usando para ello el método addEventListener, especificando en él el tipo de evento, se establece una función, en este caso tipo flecha, en donde se especifican los valores a retornar según evento de entrada del usuario */
document.addEventListener("keydown", e =>{
    //Condicional simple para ejecución de acciones siempre y cuando el juego esté activo, es decir, cuando el valor de la variable endGame sea diferente de false (valor inicial)
    if(!board.endGame){
        //Estructura de control switch para establecer bajo qué casos (eventos del teclado) efectuar las funciones de movimiento asociadas a las teclas del juego
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

//Función para detener el juego
function pause(){
    //reasignación de valor de variable 
    playing = !playing
    if(playing){
        stop()
        //Se define el bucle del juego en el que a través del método setInterval se establece una función que ejecutará un fragmento de código de forma reiterada, con un retardo de tiempo fijo entre cada llamada.
        gameloop = setInterval(() => {
            //Si endGame es false (Quiere decir que el juego no ha terminado), se ejecutará el siguiente bloque de código
            if(!board.endGame){
                board.moveDown() //Método de descenso automático de la figura
                nextF.clearBoard() //Método que borra y/o limpia el tablero
                nextF.refresh(board.nextF) //Actualización del tetromino en el tablero
                moreLevel() //Llamado a la función para determinar el nivel del juego actual
            }
            //Si endGame es true (Quiere decir que el juego ha terminado), se ejecutará el siguiente bloque de código
            else{
                //Si el dispositivo es móvil, se modificará el valor de la propiedad en css, en este caso, aquellas que corresponden a los botones
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.documentElement.style.setProperty("--btn-p","flex")
                    document.documentElement.style.setProperty("--btn-m","none")
                }else{
                    //De no ser móvil, al botón de inicio se le removerá de su lista de clases, aquella clase que se llame disable, lo que permitirá al usuario reiniciar la partida
                    BTN_PLAY.classList.remove("disable")
                }  
                stop()//Llamado a la función stop para detener ejecución del método setInterval
            }
        },deltaTime) //Variable de intervalo de tiempo
        //deltaTime = lastDelta
    }else{
        stop()
    }
}

//Función para detener ejecución
function stop(){
    //El método clearInterval() es utilizado para detener las ejecuciones de la función especificada en el método setInterval()
    clearInterval(gameloop)
}

//Función de aumento de nivel del juego
function moreLevel(){
    //Si el valor de la variable scoreLevel es mayor o igual a 500 ejecutará el siguiente bloque de código
    if(board.scoreLevel >= 500){
        board.scoreLevel = 0 //Reseteará el valor de la variable scoreLevel
        board.level++ //Aumentará en una unidad el valor de la variable level (nivel del juego)
        board.levelTxt.textContent = board.level //Se accederá al contenido textual del elemento levelTxt y se le asignará el valor actual de level
        deltaTime -= 50 //Disminución de valor de intervalo en el gameloop, lo cual hace que aumente la velocidad del juego
        stop() //Llamado a la función stop para detener ejecución
        gameloop = setInterval(() => {
            if(!board.endGame){
                board.moveDown()//Método de descenso automático de la figura
                nextF.clearBoard()//Método que borra y/o limpia el tablero
                nextF.refresh(board.nextF)//Actualización del tetromino en el tablero
                moreLevel()//Llamado a la función para determinar el nivel del juego actual
            }else{
                //Si el dispositivo es móvil, se modificará el valor de la propiedad en css, en este caso, aquellas que corresponden a los botones
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.documentElement.style.setProperty("--btn-p","flex")
                    document.documentElement.style.setProperty("--btn-m","none")
                }else{
                    //De no ser móvil, al botón de inicio se le removerá de su lista de clases, aquella clase que se llame disable, lo que permitirá al usuario reiniciar la partida
                    BTN_PLAY.classList.remove("disable") 
                }
                stop()//Llamado a la función stop para detener ejecución del método setInterval
            }
        },deltaTime)//Variable de intervalo de tiempo
    }
}

//Función de acciones mientras el juego esté activo
function playGame(){
    //Estructura de control doble para determinar el tamaño de celda del tablero de la figura siguiente
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        nextF = new Board(C_NEXT,4,5,CELL_EDGE / 2)
    }else{
        nextF = new Board(C_NEXT,4,5,CELL_EDGE)
    }
    //Instanciación de la clase Board para dibujar el tablero del tetris
    board = new Board(CANVAS,ROWS, COLS, CELL_EDGE)
    board.levelTxt.textContent = board.level //Acceso al contenido textual del elemento levelTxt y asignación de valor del nivel actual
    board.drawMatriz()//Dibujado de matriz del tablero del tetris
    nextF.drawMatriz()//Dibujado de matriz del tablero de la figura siguiente
    //Instanciación de la clase Figuras para la creación de los tetrominos de manera aleatoria
    let figureM = new Figuras().tetrominoRandom();
    board.nextF = figureM //Asignación del tetromino creado al tablero de la figura siguiente
    if(playing){
        //Declaración e inicialización de variable que trae el elemento 'lose' del DOM, el cual corresponde al mensaje de "Game over" sobre el tablero, a mostrar cuando el usuario pierde la partida
        let lose = document.getElementById ("lose")
        lose.classList.replace("lose", "hide")//Mientras playing se mantenga True, dicho elemento permanecerá oculto a través de la clase asociada hide
        board.refresh(figureM)//Actualización de la figura en el tablero del tetris
        nextF.refresh(board.nextF)//Actualización de la figura en el tablero de la figura próxima
        //Bucle definido bajo un intervalo de tiempo
        gameloop = setInterval(() => {
            if(!board.endGame){
                board.moveDown()//Método de descenso automático de la figura
                nextF.clearBoard()//Método que borra y/o limpia el tablero
                nextF.refresh(board.nextF)//Actualización del tetromino en el tablero
                moreLevel()//Llamado a la función para determinar el nivel del juego actual
            }else{
                //Si el dispositivo es móvil, se modificará el valor de la propiedad en css, en este caso, aquellas que corresponden a los botones
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.documentElement.style.setProperty("--btn-p","flex")
                    document.documentElement.style.setProperty("--btn-m","none")
                }else{
                    //De no ser móvil, al botón de inicio se le removerá la de su lista de clases, aquella que se llame disable, lo que permitirá al usuario reiniciar la partida
                    BTN_PLAY.classList.remove("disable")
                }
                stop()//Llamado a la función stop para detener ejecución del método setInterval
            }
        },deltaTime)//Variable de intervalo de tiempo
    }
    //Si el dispositivo es móvil, se modificará el valor de la propiedad en css, en este caso, aquellas que corresponden a los botones
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        document.documentElement.style.setProperty("--btn-m","grid")
        document.documentElement.style.setProperty("--btn-p","none")
    }else{
        //De no ser móvil, al botón de inicio se le agregará a su lista de clases, aquella clase que se llame disable, lo que no permitirá al usuario ejecutar algún acción sobre dicho botón
        BTN_PLAY.classList.add("disable")
    }
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

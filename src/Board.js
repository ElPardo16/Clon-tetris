class Board{
    //Se definen en el constructor de la clase aquellos párametros necesarios para la instanciación del objeto
    constructor(board, rsize, csize, edge){
        let contador = .2;
        this.board = board //Canvas
        this.ctx = board.getContext("2d") //Contexto de dibujo asociado al lienzo (canvas), en este caso, un contexto de dos dimensiones(2d).
        this.cellSize = edge //celda
        this.cols = csize //número de columnas
        this.rows = rsize //número de filas
        this.width = csize * this.cellSize //Cálculo para definir ancho de celda
        this.height = rsize * this.cellSize //Cálculo para definir alto de celda
        //Condicional para determinar tamaños del tablero, tanto en versión mobile como desktop
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            while(true){
                if(window.innerWidth< this.width + 60){
                    this.cellSize -= contador
                    this.width = csize * this.cellSize
                    this.height = rsize * this.cellSize
                    contador++
                }else{
                    board.width = this.width
                    board.height = this.height
                    break
                }
            }
        }else{
            while(true){
                if(window.innerHeight < this.height + 140){
                    this.cellSize -= contador
                    this.width = csize * this.cellSize
                    this.height = rsize * this.cellSize
                    contador++
                }else{
                    board.width = this.width
                    board.height = this.height
                    break
                }
            }
        }
        
        this.grid = Array.from(Array(this.rows), () => Array(this.cols).fill(0)) //Variable que contiene la matriz del tablero vacío (En donde llena cada valor de posición en 0)
        this.positions = [] //Arreglo que almacena posiciones
        this.positions2 = [] //Arreglo que almacena posiciones
        this.colls = [] //Arreglo que almacena valores de columnas
        this.actualF = [] //Variable que almacena arreglo del tetromino actual
        this.nextF = [] //Variable que almacena arreglo del tetromino siguiente
        this.numR = 0; //Variable que contiene el número de rotación
        this.r = 0;
        this.canMove = true //Variable booleana para evaluación de posible movimiento o no
        this.endGame = false //Variable booleana para determinar la finalización (o no) del juego
        this.score = document.getElementById("score") //Elemento del DOM que contiene el valor del puntaje del juego
        this.levelTxt = document.getElementById("level") //Elemento del DOM que contiene el valor del nivel del juego
        this.scoreTotal = 0 //Variable para cálculo de puntaje total
        this.scoreLevel = 0 //Variable que relaciona el nivel del juego con el puntaje
        this.level = 1 //Variable del nivel actual del juego
        this.score.textContent = 0 //Valor inicial para contenido textual del elemento 'score' (puntaje del juego)
        this.levelTxt.textContent = 1 //Valor inicial para contenido textual del elemento 'levelTxt' (Nivel del juego)
        this.sound = document.getElementById("sonido") //Elemento del DOM en el que se albergarán los sonidos del juego
    }
    
    //Método para dibujar tablero del tetris
    drawBackground(){
        this.ctx.strokeStyle = "#000000" //Estilo de la línea del tablero (color)
        let posC = 0; //posición de columnas
        let posR = 0; //posición de filas
        let vacio = true; //Variable booleana para determinar el dibujado del tablero
        //Bucle while que evalúa si el tablero se encuentra vacío o no (Si ya dibujó sus celdas o no)
        while(vacio){
            /*El strokeRect() es un método que dibuja un rectángulo trazado cuyo punto de inicio está en (x, y) y cuyo tamaño está especificado por width y height*/
            this.ctx.strokeRect(posC, posR, this.cellSize, this.cellSize);
            posC += this.cellSize
            if(posR / this.rows == this.cellSize){
                vacio = false
            }else if(posC / this.cols == this.cellSize){
                posC = 0
                posR += this.cellSize
            }
        }
    }

    //Método para actualización de tetromino
    refresh(figure){
        this.canMove = true //Variable para determinar si se pueden hacer movimientos o no
        let midX = Math.round(this.cols / 2) //Variable que determina el valor medio del número de columnas del tablero, para dar lugar a la aparición del nuevo tetromino
        this.actualF = figure; //Tetromino
            //Método forEach para recorrer el tetromino
            this.actualF.forEach((item, indexM) =>{
                this.positions2[indexM] = [] //Se crea un nuevo arreglo y se asignan valores a este conforme el forEach recorre el arreglo de la figura
                item.forEach((sItem, index) =>{
                    let col = (midX + index) - 2
                    this.grid[indexM][col] = sItem
                    this.positions.unshift([indexM, col])
                    
                    this.positions2[indexM].push([indexM, col, sItem])
            })
        })
        
        this.nextF = new Figuras().tetrominoRandom(); //Instanciación de la clase Figuras para la creación de un tetromino de manera aleatoria
        this.drawMatriz() //Se llama función para dibujar matriz de figura
    }
    //Método de rotación de figuras
    rotate(){
        this.clean()//Se llama método para limpiar el arreglo de la figura para después dibujarla nuevamente
        // Si el nimero de rotaciones es diferente de 0
        if(this.numR == 0){
            //Si 0 se rota con respecto a la figura original
            this.r = this.actualF[0].map((val, index) => this.actualF.map(row => row[index]).reverse())
            //Con map generamos un nuevo arreglo rotado
        }else{
            //Se rota con respecto a la rotacion anterior
            this.r = this.r[0].map((val, index) => this.r.map(row => row[index]).reverse())
        }
        this.numR++
        let row = 0;
        let c = 0;
        // Dibujamos la figura nuevamente en su nueva posicion
        this.positions2.forEach((itemM,indexM) => {
            itemM.forEach((item, index) => {
                this.grid[item[0]][item[1]] = this.r[row][c]
                this.positions2[indexM][index] = [item[0] , item[1] , this.r[row][c]]
                c++
                // Aumentamos la fila para que pase a la siguiente, cuando la columna llega a su valor maximo
                if(c >= this.r.length){
                    c = 0
                    row++
                }
            })
        })
        //console.table(this.positions2)
        //Redibujamos el canvas
        this.drawMatriz()
    }
    //Método para desplazar figura hacía la derecha
    moveRight(){
        //Evaluación de condición para determinar si no existe elemento que genere colisión hacia la derecha
        if(!this.collisionRight()){
            this.clean()//Se llama método para limpiar el arreglo de la figura
            //Se recorre el arreglo que alberga las posiciones del tetromino
            this.positions2.forEach((itemM,indexM) =>{
                //En este caso de hace uso del bucle for, lo cual permite recorrer el arreglo de manera inversa, evitando así errores de eliminación y/o dibujado de la figura
                for(let i = itemM.length - 1; i >= 0; i--){
                    //Si el valor del índice es igual a cero, se almacenará posición y valor en arreglo positions2, más no se dibujará
                    if(itemM[i][2] == 0){
                        this.positions2[indexM][i] = [itemM[i][0] , itemM[i][1] + 1, itemM[i][2]]
                    }else{
                        //De lo contrario, aquellos valores diferentes de 0, los desplazará hacia la derecha modificando el valor de las columnas (aumentando la columna de la figura en una unidad) y los dibujará
                        this.grid[itemM[i][0]][itemM[i][1] + 1] = itemM[i][2]
                        this.positions2[indexM][i] = [itemM[i][0] , itemM[i][1] + 1, itemM[i][2]]
                        //this.grid[itemM[i][0]][itemM[i][1] - 1] = 0
                    }
                }
            })
            //console.table(this.positions2)
            this.drawMatriz()
        }
    }

    //Método para desplazamiento de la figura hacía la izquierda
    moveLeft(){
        //Evaluación de condición para determinar si no existe elemento que genere colisión hacia la izquierda
        if(!this.collisionLeft()){
            this.clean()//Se llama método para limpiar el arreglo de la figura
            //Se recorre el arreglo que alberga las posiciones del tetromino
            this.positions2.forEach((itemM,indexM) =>{
                itemM.forEach((item, index) => {
                    //Si el valor del índice es igual a cero, se almacenará posición y valor en arreglo positions2, más no se dibujará
                    if(item[2] == 0){
                        this.positions2[indexM][index] = [item[0], item[1]  - 1, item[2]]
                    }else{
                        //De lo contrario, aquellos valores diferentes de 0, los desplazará hacia la izquierda modificando el valor de las columnas (aumentando la columna de la figura en una unidad) y los dibujará
                        this.grid[item[0]][item[1] - 1] = item[2]
                        this.positions2[indexM][index] = [item[0] , item[1] - 1, item[2]]
                        //this.grid[item[0]][item[1]] = 0 
                    }
                })
            })
            //console.table(this.positions2)
            this.drawMatriz()//Llamado al método para dibujar figura
        }
    }

    //Método para desplazamiento descendente de la figura
    moveDown(){
        //Evaluación de condición para determinar si no existe elemento que genere colisión al descender una fila
        if(!this.collisionDown()){
            this.clean() //Se llama método para limpiar el arreglo de la figura
            //console.log(this.collisionDown())
            //Se recorre el arreglo que alberga las posiciones del tetromino
            this.positions2.forEach((itemM,indexM) =>{

                for(let i = itemM.length - 1; i >= 0; i--){
                    //Si el valor del índice es igual a cero, se almacenará posición y valor en arreglo positions2, más no se dibujará
                    if(itemM[i][2] == 0){
                        this.positions2[indexM][i] = [itemM[i][0]  + 1, itemM[i][1], itemM[i][2]]
                    //De lo contrario, aquellos valores diferentes de 0, los desplazará hacia abajo modificando el valor de las filas (aumentando la fila de la figura en una unidad) y los dibujará
                    }else{
                        this.grid[itemM[i][0] + 1][itemM[i][1]] = itemM[i][2]
                        this.positions2[indexM][i] = [itemM[i][0] + 1, itemM[i][1], itemM[i][2]]
                    }
                }
            })
            this.drawMatriz() //Llamado al método para dibujar figura
            this.scoreTotal += 2 //Se aumenta el puntaje en 2 puntos al descender la figura
            this.scoreLevel += 2 //Se aumenta el puntaje relacionado al nivel en 2 puntos al descender la figura
        }else{
            this.deleteFullRows() //Llamado del método que detecta y elimina filas llenas
            /*let figure = new Figuras().tetrominoRandom(); */
            /* this.nextF = figure */
            //Condicional que ejecuta bloque de acciones si el juego no ha terminado
            if(!this.gameOver(this.nextF)){
                this.positions2 = [] //Resetea arreglo de posiciones
                this.actualF = [] //Resetea arreglo de figura
                this.numR = 0; 
                this.r = 0;
                this.refresh(this.nextF) //Actualiza la figura del tablero
                this.drawMatriz() //Dibuja la figura en el tablero
                this.scoreTotal += 10 //Aumenta el puntaje en 10 puntos al colisionar en la parte de inferior
                this.scoreLevel += 10 //Aumenta el puntaje relacionado al nivel en 10 puntos al colisionar en la parte de inferior
            }else{
                console.log("Perdiste")
            }
            
        }
        this.score.textContent = this.scoreTotal //Accede al contenido textual del puntaje y actualiza a su valor actual
    }

    //Metodo para "limpiar" la matriz de las figuras
    clean(){
        //Se recorre el arreglo creado a partir de las posiciones de la figura almacenadas, en donde a cada valor en la matriz diferente de 0 (Es decir, con índices correspondientes a la figura), reasignará valor de 0 a dichos índices. En resumen, resetea la matriz con valores de 0, borrando por completo la figura, para que en el próximo movimiento esta se dibuje de nuevo.
        this.positions2.forEach((itemM,indexM) =>{
            for(let i = itemM.length - 1; i >= 0; i--){
                if(itemM[i][2] != 0){
                    this.grid[itemM[i][0]][itemM[i][1]] = 0
                }
            }
        })
        
    }
    
    //Método para dibujar las matrices de las figuras
    drawMatriz(){
        /*El método clearRect() convierte todos los pixeles en el rectangulo definido por el punto de inicio (x, y) y tamaño (width, height) a negro transparente, borrando cualquier contenido dibujado anteriormente.*/
        this.ctx.clearRect(0, 0, this.width, this.height)
        //A través del método forEach() se recorre en primera instancia las filas del tablero y posteriormente las columnas dentro de cada fila
        this.grid.forEach((item,index) => {
            item.forEach((item2,index2) => {   
                //Estructura de control múltiple que entra a evaluar el valor del índice de la columna, estableciendo de esta manera 8 casos, en lo que el caso 0 (índice 0) corresponderá a aquellos espacios vacíos, y aquellos casos de 1 a 7 (índices de 1 a 7), corresponderán a los índices de los tetrominos
                switch(item2){
                    case 0:
                        this.ctx.strokeStyle = "#C0BFC0"
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 1:
                        this.ctx.strokeStyle = "#BD3A97" //Asignación de estilo de línea (Color de la línea de celda a dibujar)
                        this.ctx.fillStyle = "#EB8FD0" //Asignación de estilo de llenado (Color de relleno de celda)
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)//El fillRect() es un método que rellena con color aquella celda que se define en (posiciónX, posiciónY, Ancho, Alto)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)//El strokeRect() es un método que dibuja un rectángulo trazado (Las líneas únicamente) cuyo punto de inicio está en (x, y) y cuyo tamaño está especificado por width y height
                        break //Palabra reservada para romper la ejecución de dicho bloque de código
                    case 2:
                        this.ctx.strokeStyle = "#CE5711"
                        this.ctx.fillStyle = "#FF904E" 
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 3:
                        this.ctx.strokeStyle = "#4DAA26"
                        this.ctx.fillStyle = "#7ED958"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 4:
                        this.ctx.strokeStyle = "#C0890A"
                        this.ctx.fillStyle = "#FED16A"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 5:
                        this.ctx.strokeStyle = "#B50746"
                        this.ctx.fillStyle = "#DC0C57"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 6:
                        this.ctx.strokeStyle = "#0083D0"
                        this.ctx.fillStyle = "#37B5FF"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 7:
                        this.ctx.strokeStyle = "#5428AE"
                        this.ctx.fillStyle = "#8B53FF"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                }
            })
        })
    }
    //Método para detectar colisiones en la parte inferior del tetromino
    collisionDown(){
        //console.log(this.positions2[this.positions2.length - 1])
        let collision = false //variable booleana cuyo valor cambia si encuentra un collider (celdas que colindan la figura), con valor diferente de 0
        let collider = 0 //Variable que almacena la cantidad de colisiones inferiores posibles en cada tetromino
        let aux = 1 //Variable auxiliar contadora que ayuda a recorrer la matriz desde la parte inferior hacia la superior
        let cols = [] //Variable que almacena valores de columna para descartar errores de colliders dentro de la misma figura
        let repeat = 0;
        //console.log(this.positions2.length)
        //Bucle que se ejecute mientras el colider sea menor al tamaño del arreglo
        while (collider < this.positions2.length) {
            //Si el collider es igual a uno o 2 y la variable auxiliar supera el tamaño del arreglo, esto quiere decir que ya terminó de recorrer el tetromino y se para ejecución de dicho bloque de código
            if((collider == 2 && aux > this.positions2.length) || (collider == 1 && aux > this.positions2.length)){
                break
            }
            //Recorremos la ultima fila del arreglo, si no se encuentra collider entoces pasamos a la siguiente
            this.positions2[this.positions2.length - aux].forEach((item, index) => {
                //Obtenemos el valor de la posicion y si es diferente de 0
                //podria ser un collider
                if (item[item.length - 1] != 0 && collider < this.positions2.length) {
                        //Recorremos la lista de colliders para verificar que no se encuentren
                        //en la misma fila o columna
                        cols.forEach((item2, index2) => {
                            if(item2 == item[1]){
                                //Si lo estan, entoces aumentamos el valor de repeat
                                repeat++
                            }
                        })
                        //console.log(repeat)
                        //si ningun collider se repite, entonces lo agregamos
                        if(repeat == 0){
                            this.colls[collider] = [item[0] + 1, item[1]]
                            cols.push(item[1])
                            // sumamos 1 al numero de collider
                            collider++
                        }
                        repeat = 0
                }
            })
            aux++
        }
        //console.log(this.colls)

        if (this.grid?.[this.colls[0][0]] === undefined) {
            //console.log("no existe")
            this.colls = []
            return true
        }

        //Se recorre el arreglo de las columnas para evaluar si sus valores son diferentes de 0, en caso de serlo, quiere decir que hay una figura que colisiona en la parte inferior, por lo cual se hace necesario cambiar el valor de la variable collision, indicando que si existe una colisión
        this.colls.forEach((item,index) => {
            if(this.grid[item[0]][item[1]] != 0){
                //console.log("coque con "+ this.grid[item[0]][item[1]])
                collision = true
                this.colls = []
            }
        })
        //Condicional para resetear arreglo colls nuevamente (Por seguridad) y retornar valor true
        if(collision){
            this.colls = []
            return true
        }
        this.colls = [] //Al finalizar, nuevamente se resetea el arreglo cols
        
    }

    //Método para detectar colisiones a la izquierda del tetromino
    collisionLeft() {
        let collision = false //variable booleana cuyo valor cambia si encuentra un collider (celdas que colindan la figura), con valor diferente de 0
        let collider = 0 //Variable que almacena la cantidad de colisiones izquierdas posibles en cada tetromino
        let aux = 1 //Variable auxiliar contadora que ayuda a recorrer la matriz desde la parte inferior hacia la superior
        let rows = [] //Variable que almacena valores de fila para descartar errores de colliders dentro de la misma figura
        let repeat = 0; 
        //Bucle que se ejecute mientras el colider sea menor al tamaño del arreglo
        while (collider < this.positions2.length) {
            //Si el collider es igual a uno o 2 y la variable auxiliar supera el tamaño del arreglo, esto quiere decir que ya terminó de recorrer el tetromino y se para ejecución de dicho bloque de código
            if ((collider == 2 && aux > this.positions2.length) || (collider == 1 && aux > this.positions2.length)) {
                break
            }
            this.positions2[this.positions2.length - aux].forEach((item, index) => {
                if (item[item.length - 1] != 0 && collider < this.positions2.length) {
                    rows.forEach((item2, index2) => {
                        if (item2 == item[0]) {
                            repeat++
                        }
                    })
                    if (repeat == 0) {
                        this.colls[collider] = [item[0], item[1] - 1]
                        rows.push(item[0])
                        collider++
                    }
                    repeat = 0
                }
            })
            aux++
        }

        /* if (this.grid?.[this.colls[0][0]] === undefined) {
            this.colls = []
            return true
        } */
        //Se recorre el arreglo de las columnas para evaluar si sus valores son diferentes de 0, en caso de serlo, quiere decir que hay una figura que colisiona en la parte inferior, por lo cual se hace necesario cambiar el valor de la variable collision, indicando que si existe una colisión
        this.colls.forEach((item, index) => {
            if (this.grid[item[0]][item[1]] != 0) {
                collision = true
                this.colls = []
            }
        })
        //Condicional para resetear arreglo colls nuevamente (Por seguridad) y retornar valor true
        if (collision) {
            this.colls = []
            return true
        }
        this.colls = [] //Al finalizar, nuevamente se resetea el arreglo cols
    }

    //Método para detectar colisiones a la derecha del tetromino
    collisionRight() {
        let collision = false //variable booleana cuyo valor cambia si encuentra un collider (celdas que colindan la figura), con valor diferente de 0
        let collider = 0 //Variable que almacena la cantidad de colisiones a la derecha posibles en cada tetromino
        let aux = 1 //Variable auxiliar contadora que ayuda a recorrer la matriz desde la parte inferior hacia la superior
        let rows = [] //Variable que almacena valores de fila para descartar errores de colliders dentro de la misma figura
        let repeat = 0;
        //Bucle que se ejecute mientras el colider sea menor al tamaño del arreglo
        while (collider < this.positions2.length) {
            //Si el collider es igual a uno o 2 y la variable auxiliar supera el tamaño del arreglo, esto quiere decir que ya terminó de recorrer el tetromino y se para ejecución de dicho bloque de código
            if ((collider == 2 && aux > this.positions2.length) || (collider == 1 && aux > this.positions2.length)) {
                break
            }
            this.positions2[this.positions2.length - aux].slice().reverse().forEach((item, index) => {
                if (item[item.length - 1] != 0 && collider < this.positions2.length) {
                    rows.forEach((item2, index2) => {
                        if (item2 == item[0]) {
                            repeat++
                        }
                    })
                    if (repeat == 0) {
                        this.colls[collider] = [item[0], item[1] + 1]
                        rows.push(item[0])
                        collider++
                    }
                    repeat = 0
                }
            })
            aux++
        }
        /* if (this.grid?.[this.colls[0][0]] === undefined) {
            this.colls = []
            return true
        } */
        //Se recorre el arreglo de las columnas para evaluar si sus valores son diferentes de 0, en caso de serlo, quiere decir que hay una figura que colisiona en la parte inferior, por lo cual se hace necesario cambiar el valor de la variable collision, indicando que si existe una colisión
        this.colls.forEach((item, index) => {
            if (this.grid[item[0]][item[1]] != 0) {
                collision = true
                this.colls = []
            }
        })
        //Condicional para resetear arreglo colls nuevamente (Por seguridad) y retornar valor true
        if (collision) {
            this.colls = []
            return true
        }
        this.colls = [] //Al finalizar, nuevamente se resetea el arreglo cols
    }
    /* collision(nextBlock, i){
        if(this.grid[nextBlock - 1][i] != 0){
            if(nextBlock > this.grid.length - 1 ){
                console.log("toco p")
                this.canMove = false
                return true
            }else if(nextBlock < this.grid.length - 1){
                if(this.grid[nextBlock][i] != 0){
                    console.log("toco")
                    this.canMove = false
                    return true
                }else{
                    console.log("f")
                    return false
                }
            }else{
                return false
            }
        }
    } */

    /* drawForm(){
        let posI = this.width / 2 - this.cellSize / 2
        let posY = 0
        this.ctx.fillStyle = "#00ff00"
        this.ctx.strokeRect(posI, posY, this.cellSize, this.cellSize);
        setInterval(() => this.translateForm(posI, posY), 2000)
    }
    translateForm(pX, pY){
        pY += this.cellSize
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.drawBackground()
        this.ctx.fillRect(pX,pY , this.cellSize, this.cellSize);
    }
    printc(){
        console.log(this.rows)
    } */

    //Método para dectectar y eliminar las filas llenas
    deleteFullRows(){
        let tablero = this.grid //Variable que alberga la matriz del tablero
        let lines = 0 //Variable contadora de la cantidad de lineas eliminadas
        //Bucle para recorrer las filas del tablero
        for (let row in tablero){
            let counter = 0; //Declaración e iniicialización de contador para la cantidad de columnas en cada fila
            //Bucle que recorre las columnas en cada fila
            for (let col in tablero[row]){
                //Estructura de condición simple para evaluar los índices actuales, en los que si son diferentes de 0, se asume que ahí una figura dibujada allí
                if(tablero[row][col] >= 1){
                    counter = counter + 1 //Si encuentra un índice diferente de 0 (los de los tetrominos), aumentará el contador en una unidad
                    //Estructura de condición simple en la que se evalúa si el valor de counter es igual a la cantidad de columnas del tablero, en donde si es true, indicará que la fila está llena con figuras
                    if(counter == this.cols){
                        this.sound.innerHTML = `<audio src="/src/sounds/drop.wav" autoplay></audio>` //Inserción en html del sonido de eliminación de fila
                        tablero.splice(row, 1) //Método splice() (Propio de los arreglos) para eliminación de fila actual 
                        tablero.unshift(Array(this.cols).fill(0)) //Método unshift() (Propio de los arreglos) para añadir nuevo elemento al inicio del arreglo del tablero. En él se establece el elemento a añadir (nuevo arreglo, el cual tendrá el número de columnas definidas en el objeto y cada posición será llenada con un 0)
                        lines++ //Aumento en una unidad al contador de líneas eliminadas
                    }
                }
            }
        }
        this.scoreRow(lines) //Llamado al método para cálculo del puntaje
    }

    //Método que calcula el puntaje según la cantidad de líneas eliminadas a la vez
    scoreRow(row){
        let singleRow = 100 //Puntaje de eliminación de una fila
        let dobleRow = 250 //Puntaje de eliminación de dos filas
        let tripleRow = 500 //Puntaje de eliminación de tres filas
        /*Estructura de control múltiple para actualización y asignación de puntajes en donde se actualizan tanto la variable de scoreTotal, como la de scoreLevel, sumando al valor actual que tienen, el valor nuevo según las líneas eliminadad*/
        if (row == 1){    
            this.scoreTotal += singleRow
            this.scoreLevel += singleRow
        }else if (row == 2){
            this.scoreTotal += dobleRow
            this.scoreLevel += dobleRow
        }else if(row >= 3){
            this.scoreTotal += tripleRow
            this.scoreLevel += tripleRow
        }
        this.score.textContent = this.scoreTotal //Se accede al contenido textual de la variable score y se le asigna el contenido de la variable scoreTotal (Cálculo recientemente hecho)
    }

    //Método de finalización del juego
    gameOver(tetro){
        let end = false //Variable para controlar si el juego ha finalizado o no
            //Se recorre el tablero tomando como base el tetromino nuevo, del cual se obtiene la longitud de su arreglo y compara la fila siguiente en donde si contiene un índice diferente de 0, es porque hay una figura allí y eso impediría el dibujado de la figura. Es decir, el tablero se llenó y el usuario perdió.
            this.grid[tetro.length - 1].forEach((item, index)=>{
                if(item != 0){
                    end = true
                    this.endGame = end //Se asigna el valor de la variable end a la variable endGame de mayor scope
                    this.sound.innerHTML = `<audio src="/src/sounds/soundGameOver.mp3" autoplay></audio>` //Inserción en html de sonido de partida perdida 
                    let lose = document.getElementById ("lose") //Elemento del DOM que corresponde al mensaje de "GAME OVER" sobre el tablero
                    lose.classList.replace("hide", "lose") //Se accede a la lista de clases de dicho elemento, y se reemplaza la clase que lo mantenía oculto por la clase que contiene todas las propiedades para su visualización
                    //El método setTimeout() permite ejecutar un fragmento de código, una vez transcurrido un tiempo determinado
                    setTimeout(()=>{
                        //Invocación de la alerta de la librería SweetAlert (Librería que permite personalizar las alertas)
                        Swal.fire({
                        title: '',
                        imageUrl: 'https://i.postimg.cc/c4kW8q66/gameOver.png',
                        imageWidth: 200,
                        imageHeight: 150,
                        text: "Presiona el botón 'Jugar' para reiniciar la partida",
                        confirmButtonColor:"green",
                        confirmButtonText:'Ok :(',
                        showConfirmButton: true,
                        timer: 8000,
                        timerProgressBar: true
                    })},2500) //Tiempo a esperar para ejecución de la alerta

                }
            })
            //Si el valor de end es true, el botón será visible para que el usuario juegue nuevamente
            //Retorna valores booleanos en ambos casos, de los cuales dependen funciones en el script Holder
            if(end){
                document.documentElement.style.setProperty("--btn-p","flex")
                return true 
            }else{
                return false
            }
    }

    //Método para limpiar el tablero
    clearBoard(){
        //Al arreglo que corresponde al tablero del tetris le es asignado un arreglo de filas (Tantas como se indique en la instanciación), compuesta cada una por un arreglo de columnas (Tantas como se indique en la instanciación), rellenando cada valor de sus índices con 0 (Espacios vacíos)
        this.grid = Array.from(Array(this.rows), () => Array(this.cols).fill(0))
    }

    /*gameOver(tetro){
        let end = true;
        if(tetro.length == 2){
            for(let i in this.grid[2]){
                if (i >= 4 && i <= 6){
                    if(this.grid[2][i] != 0){
                        console.log("No más")
                        return
                    }
                    else{
                        this.refresh(tetro)
                        this.drawMatriz()
                    }
                }
            }
        }
        else if(tetro.length == 3){
            for(let i in this.grid[3]){
                if (i >= 4 && i <= 8){
                    if(this.grid[3][i] != 0){
                        console.log("No más")
                        
                        return
                    }
                    else{
                        this.refresh(tetro)
                        this.drawMatriz()
                    }
                }
            }
        }
        else if(tetro.length == 4){
            for(let i in this.grid[4]){
                if (i >= 6 && i <= 7){
                    if(this.grid[3][i] != 0){
                        console.log("No más")
                        return
                    }
                    else{
                        this.refresh(tetro)
                        this.drawMatriz()
                    }
                }
            }
        }
        
    }*/
}
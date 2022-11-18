class Board{
    constructor(board, rsize, csize, edge){
        let contador = .2;
        this.board = board
        this.ctx = board.getContext("2d")
        this.cellSize = edge
        this.cols = csize
        this.rows = rsize
        this.width = csize * this.cellSize
        this.height = rsize * this.cellSize
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
        
        this.grid = Array.from(Array(this.rows), () => Array(this.cols).fill(0))
        this.positions = []
        this.positions2 = []
        this.colls = []
        this.actualF = []
        this.nextF = []
        this.numR = 0;
        this.r = 0;
        this.canMove = true
        this.endGame = false
        this.score = document.getElementById("score")
        this.levelTxt = document.getElementById("level")
        this.scoreTotal = 0
        this.scoreLevel = 0
        this.level = 1
        this.score.textContent = 0
        this.levelTxt.textContent = 1
        this.sound = document.getElementById("sonido")
    }
    
    drawBackground(){
        this.ctx.strokeStyle = "#000000"
        let posC = 0;
        let posR = 0;
        let vacio = true;
        while(vacio){
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
    refresh(figure){
        this.canMove = true
        let midX = Math.round(this.cols / 2)
        //let fRow = false
        this.actualF = figure;
            this.actualF.forEach((item, indexM) =>{
                this.positions2[indexM] = []
                item.forEach((sItem, index) =>{
                    let col = (midX + index) - 2
                    this.grid[indexM][col] = sItem
                    this.positions.unshift([indexM, col])
                    
                    this.positions2[indexM].push([indexM, col, sItem])
            })
        })
        this.nextF = new Figuras().tetrominoRandom();
        //console.table(this.positions2)
        //console.log(this.nextF)
        this.drawMatriz()
    }
    rotate(){
        this.clean()
        if(this.numR == 0){
            this.r = this.actualF[0].map((val, index) => this.actualF.map(row => row[index]).reverse())
        }else{
            this.r = this.r[0].map((val, index) => this.r.map(row => row[index]).reverse())
        }
        this.numR++
        let row = 0;
        let c = 0;
        this.positions2.forEach((itemM,indexM) => {
            itemM.forEach((item, index) => {
                this.grid[item[0]][item[1]] = this.r[row][c]
                this.positions2[indexM][index] = [item[0] , item[1] , this.r[row][c]]
                c++
                if(c >= this.r.length){
                    c = 0
                    row++
                }
            })
        })
        //console.table(this.positions2)
        this.drawMatriz()
    }
    moveRight(){
        if(!this.collisionRight()){
            this.clean()
            this.positions2.forEach((itemM,indexM) =>{
                for(let i = itemM.length - 1; i >= 0; i--){
                    if(itemM[i][2] == 0){
                        this.positions2[indexM][i] = [itemM[i][0] , itemM[i][1] + 1, itemM[i][2]]
                    }else{
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
    moveLeft(){
        if(!this.collisionLeft()){
            this.clean()
            this.positions2.forEach((itemM,indexM) =>{
                itemM.forEach((item, index) => {
                    if(item[2] == 0){
                        this.positions2[indexM][index] = [item[0], item[1]  - 1, item[2]]
                    }else{
                        this.grid[item[0]][item[1] - 1] = item[2]
                        this.positions2[indexM][index] = [item[0] , item[1] - 1, item[2]]
                        //this.grid[item[0]][item[1]] = 0 
                    }
                })
            })
            //console.table(this.positions2)
            this.drawMatriz()
        }
    }
    moveDown(){
        if(!this.collisionDown()){
            this.clean()
            //console.log(this.collisionDown())
            this.positions2.forEach((itemM,indexM) =>{
                for(let i = itemM.length - 1; i >= 0; i--){
                    if(itemM[i][2] == 0){
                        this.positions2[indexM][i] = [itemM[i][0]  + 1, itemM[i][1], itemM[i][2]]
                    }else{
                        this.grid[itemM[i][0] + 1][itemM[i][1]] = itemM[i][2]
                        this.positions2[indexM][i] = [itemM[i][0] + 1, itemM[i][1], itemM[i][2]]
                    }
                }
            })
            this.drawMatriz()
            this.scoreTotal += 2
            this.scoreLevel += 2
        }else{
            this.deleteFullRows()
       /*      let figure = new Figuras().tetrominoRandom(); */
            /* this.nextF = figure */
            if(!this.gameOver(this.nextF)){
                this.positions2 = []
                this.actualF = []
                this.numR = 0;
                this.r = 0;
                //this.gameOver(figure)
                this.refresh(this.nextF)
                this.drawMatriz()
                this.scoreTotal += 10
                this.scoreLevel += 10
            }else{
                console.log("Perdiste")
            }
            
        }
        this.score.textContent = this.scoreTotal
    }
    clean(){
        this.positions2.forEach((itemM,indexM) =>{
            for(let i = itemM.length - 1; i >= 0; i--){
                if(itemM[i][2] != 0){
                    this.grid[itemM[i][0]][itemM[i][1]] = 0
                }
            }
        })
        
    }
    
    drawMatriz(){
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.grid.forEach((item,index) => {
            item.forEach((item2,index2) => {   
                switch(item2){
                    case 0:
                        this.ctx.strokeStyle = "#C0BFC0"
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 1:
                        this.ctx.strokeStyle = "#BD3A97"
                        this.ctx.fillStyle = "#EB8FD0"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
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
    collisionDown(){
        //console.log(this.positions2[this.positions2.length - 1])
        let collision = false
        let collider = 0
        let aux = 1
        let cols = []
        let repeat = 0;
        //console.log(this.positions2.length)
        while (collider < this.positions2.length) {
            if((collider == 2 && aux > this.positions2.length) || (collider == 1 && aux > this.positions2.length)){
                break
            }
            this.positions2[this.positions2.length - aux].forEach((item, index) => {
                
                if (item[item.length - 1] != 0 && collider < this.positions2.length) {
                        cols.forEach((item2, index2) => {
                            if(item2 == item[1]){
                                repeat++
                            }
                        })
                        //console.log(repeat)
                        if(repeat == 0){
                            this.colls[collider] = [item[0] + 1, item[1]]
                            cols.push(item[1])
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
        this.colls.forEach((item,index) => {
            if(this.grid[item[0]][item[1]] != 0){
                //console.log("coque con "+ this.grid[item[0]][item[1]])
                collision = true
                this.colls = []
            }
        })
        if(collision){
            this.colls = []
            return true
        }
        this.colls = []
        
    }
    collisionLeft() {
        let collision = false
        let collider = 0
        let aux = 1
        let rows = []
        let repeat = 0;
        while (collider < this.positions2.length) {
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
        this.colls.forEach((item, index) => {
            if (this.grid[item[0]][item[1]] != 0) {
                collision = true
                this.colls = []
            }
        })
        if (collision) {
            this.colls = []
            return true
        }
        this.colls = []
    }
    collisionRight() {
        let collision = false
        let collider = 0
        let aux = 1
        let rows = []
        let repeat = 0;
        while (collider < this.positions2.length) {
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
        this.colls.forEach((item, index) => {
            if (this.grid[item[0]][item[1]] != 0) {
                collision = true
                this.colls = []
            }
        })
        if (collision) {
            this.colls = []
            return true
        }
        this.colls = []
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

    deleteFullRows(){
        let tablero = this.grid
        let lines = 0
        for (let row in tablero){
            let counter = 0;
            for (let col in tablero[row]){
                if(tablero[row][col] >= 1){
                    counter = counter + 1
                    if(counter == this.cols){
                        this.sound.innerHTML = `<audio src="/src/sounds/drop.wav" autoplay></audio>`
                        tablero.splice(row, 1)
                        tablero.unshift(Array(this.cols).fill(0))
                        lines++
                    }
                }
            }
        }
        this.scoreRow(lines)
    }

    scoreRow(row){
        let singleRow = 100
        let dobleRow = 250
        let tripleRow = 500
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
        this.score.textContent = this.scoreTotal
    }

    gameOver(tetro){
        let end = false
            this.grid[tetro.length - 1].forEach((item, index)=>{
                if(item != 0){
                    end = true
                    this.endGame = end
                    this.sound.innerHTML = `<audio src="/src/sounds/soundGameOver.mp3" autoplay></audio>`
                    let lose = document.getElementById ("lose")
                    lose.classList.replace("hide", "lose")
                    
                    setTimeout(()=>{
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
                    })},2500)

                }
            })
            
            if(end){
                document.documentElement.style.setProperty("--btn-p","flex")
                return true
            }else{
                return false
            }
    }
    clearBoard(){
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
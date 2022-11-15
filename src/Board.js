class Board{
    constructor(board, rsize, csize, edge){
        this.board = board
        this.ctx = board.getContext("2d")
        this.cellSize = edge
        this.cols = csize
        this.rows = rsize
        this.width = csize * this.cellSize
        this.height = rsize * this.cellSize
        board.width = this.width
        board.height = this.height
        this.grid = Array.from(Array(this.rows), () => Array(this.cols).fill(0));
        this.positions = []
        this.positions2 = []
        this.colls = []
        this.actualF = []
        this.numR = 0;
        this.r = 0;
        this.canMove = true
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
        let t = [
            [0,0,0],
            [0,1,0],
            [1,1,1]
        ]
        let t3 = [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ]
        let t2 = [
            [1,1],
            [1,1]
        ]
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
        //console.table(this.positions2)
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
        }else{
            this.positions2 = []
                this.actualF = []
                this.numR = 0;
                this.r = 0;
                let t = [
                    [0,0,0],
                    [0,1,1],
                    [1,1,0]
                ]
                let t2 = [
                    [2,2],
                    [2,2]
                ]
                this.refresh(t2)
                this.drawMatriz()
        }
       
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
        let row = 0;
        this.ctx.clearRect(0, 0, this.width, this.height)
       
        this.grid.forEach((item,index) => {
            item.forEach((item2,index2) => {
                switch(item2){
                    case 0:
                        this.ctx.strokeStyle = "#000000"
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 1:
                        this.ctx.strokeStyle = "#000000"
                        this.ctx.fillStyle = "#00ff00"
                        this.ctx.fillRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        this.ctx.strokeRect(index2 * this.cellSize, index * this.cellSize, this.cellSize, this.cellSize)
                        break
                    case 2:
                        this.ctx.strokeStyle = "#000000"
                        this.ctx.fillStyle = "cyan"
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
            if(collider == 2 && aux > this.positions2.length){
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
            if (collider == 2 && aux > this.positions2.length) {
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
            if (collider == 2 && aux > this.positions2.length) {
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
        let tablero = this.grid;
        console.log (tablero)
        for (let row in tablero){
            console.log("row N° "+ row + " " + tablero[row])
            let arrayRow = []
            //console.log("array"+arrayRow)
            let counter = 0;
            for (let col in tablero[row]){
                console.log(tablero[row][col])
                if(tablero[row][col] == 1){
                    counter = counter + 1
                    console.log("cont " + counter)
                    if(counter == this.cols){
                        //console.log("Fullrow")
                        tablero.splice(row, 1)
                        console.log(tablero)
                        tablero.unshift(arrayRow(this.cols).fill(0))
                    }
                }
            }
        }
    }
}
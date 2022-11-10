class Board{
    constructor(board, size, edge){
        this.board = board
        this.ctx = board.getContext("2d")
        this.cellSize = edge / 2
        this.cols = size
        this.rows = size
        this.width = size * this.cellSize
        this.height = size * this.cellSize
        board.width = this.width
        board.height = this.height
        this.grid = Array.from(Array(this.rows), () => Array(this.cols).fill(0));
        this.positions = []
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
        let midX = Math.round(this.rows / 2)
        let fRow = false
        this.actualF = figure;
            this.actualF.forEach((item, indexM) =>{
                item.forEach((sItem, index) =>{
                    let col = (midX + index) - 1
                    this.grid[indexM][col] = sItem
                    this.positions.unshift([indexM, col])
                /* if(sItem != 0){
                    console.log(`${indexM} , ${index}`)
                    let col = (midX + index) - 1
                    if(indexM == 0){
                        fRow = true
                    }
                    if(fRow){
                        this.grid[indexM][col] = sItem
                        this.positions.unshift([indexM, col])
                    }else{
                        this.grid[indexM - 1][col] = sItem
                        this.positions.unshift([ indexM - 1, col])
                    }
                } */
            })
        })
        this.drawMatriz()
    }
    rotate(){
        if(this.numR == 0){
            this.r = this.actualF[0].map((val, index) => this.actualF.map(row => row[index]).reverse())
        }else{
            this.r = this.r[0].map((val, index) => this.r.map(row => row[index]).reverse())
        }
        this.numR++
        
        this.positions.forEach((itemM,index) => {
            if(itemM != 0){
                this.grid[itemM[0]][itemM[1]] = 0
            }
        })
        let row = 0;
        let c = 0;
        this.positions.slice().reverse().forEach((item,index) => {
            this.grid[item[0]][item[1]] = this.r[row][c]
            this.positions.slice().reverse()[index] = [item[0] , item[1]]
            //console.log(item[0] +". " +item[1])
            c++
            if(c >= this.r.length){
                c = 0
                row++
            }
            
        })
        this.drawMatriz()
    }
    moveRight(){
        this.positions.forEach((item,index) => {
            this.grid[item[0]][item[1] + 1] = this.grid[item[0]][item[1]]
            this.positions[index] = [item[0] , item[1] + 1]
            this.grid[item[0]][item[1]] = 0
        })
    }
    moveDown(){
        for(let [index, item] of this.positions.entries()){
            //console.log(!this.collision(item[0] + 1) +" " +item[0] + 1)
            if(!this.collision(item[0] + 1,item[1]) && this.canMove){
                if(this.grid[item[0]][item[1]] == 0){
                    this.positions[index] = [item[0] + 1 , item[1]]
                }else{
                    this.grid[item[0] + 1][item[1]] = this.grid[item[0]][item[1]]
                    this.positions[index] = [item[0] + 1 , item[1]]
                    this.grid[item[0]][item[1]] = 0
                }
                this.drawMatriz()
            }else{
                this.canMove = false
                this.positions = []
                this.actualF = []
                this.numR = 0;
                this.r = 0;
                let t = [
                    [0,0,0],
                    [0,1,1],
                    [1,1,0]
                ]
                this.refresh(t)
                this.drawMatriz()
                break
            }
        }
        //console.table(this.grid)
        /* this.positions.forEach((item,index) => {
            if(!this.collision(item[0] + 1) && this.canMove){
                this.grid[item[0] + 1][item[1]] = this.grid[item[0]][item[1]]
                this.positions[index] = [item[0] + 1 , item[1]]
                this.grid[item[0]][item[1]] = 0
                this.drawMatriz()
            }else{
                this.canMove = false
                this.positions = []
                this.actualF = []
                this.numR = 0;
                this.r = 0;
                console.log("yuca")
                let t = [
                    [0,0,0],
                    [0,1,1],
                    [1,1,0]
                ]
                this.refresh(t)
                //console.table(this.grid)
                this.drawMatriz()
            }
        }) */
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
                }
            })
        })
    }
    collision(nextBlock, i){
        if(this.grid[nextBlock - 1][i] != 0){
            //console.log(this.grid[nextBlock][i])
            if(nextBlock > this.grid.length - 1){
                return true
            }else if(nextBlock < this.grid.length - 1){
                if(this.grid[nextBlock][i] != 0){
                    console.log("sadasd")
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }

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
}
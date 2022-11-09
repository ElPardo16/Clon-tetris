class Board{
    constructor(board, size, edge){
        this.board = board
        this.ctx = board.getContext("2d")
        this.cellSize = edge
        this.cols = size
        this.rows = size
        this.width = size * this.cellSize
        this.height = size * this.cellSize
        board.width = this.width
        board.height = this.height
        this.grid = Array.from(Array(this.rows), () => Array(this.cols).fill(0));
        this.positions = []
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
    refresh(){
        let t = [
            [0,0,0],
            [0,1,0],
            [1,1,1]
        ]
      let midX = Math.round(this.rows / 2)
      let fRow = false
        t.forEach((item, indexM) =>{
            item.forEach((sItem, index) =>{
                if(sItem != 0){
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
                }
            })
        })
        console.table(this.grid)
        //console.table(this.positions)
    }
    rotate(){
        let t = [
         
            [0,1,0],
            [1,1,1]
        ]
        let t2 = [
            [1,0],
            [0,1]
        ]
        console.table(t)
        let r = t[0].map((val, index) => t.map(row => row[index]).reverse())
        console.table(r)
        r = r[0].map((val, index) => r.map(row => row[index]).reverse())
        console.table(r)
        r = r[0].map((val, index) => r.map(row => row[index]).reverse())
        console.table(r)
    }
    moveDown(){
        this.positions.forEach((item,index) => {
            this.grid[item[0] + 1][item[1]] = this.grid[item[0]][item[1]]
            this.positions[index] = [item[0] + 1 , item[1]]
            this.grid[item[0]][item[1]] = 0
        })
        console.table(this.grid)
        console.table(this.positions)
        this.rotate()
    }
    drawMatriz(){
        
    }
    drawForm(){
        let posI = this.width / 2 - this.cellSize / 2
        let posY = 0
        this.ctx.fillStyle = "#00ff00"
        this.ctx.fillRect(posI, posY, this.cellSize, this.cellSize);
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
    }
}
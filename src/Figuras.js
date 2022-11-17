class Figuras {
    constructor(){
        //this.tipo = tipo;
        this.figures = {
        1:[
            [1,1],
            [1,1],
        ], 
        2:[
            [0,0,0],
            [0,2,0],
            [2,2,2],
        ], 
        3:[
            [0,0,0],
            [0,3,3],
            [3,3,0],
        ],
        4:[
            [0,0,0],
            [4,4,0],
            [0,4,4],
        ],
        5:[
            [0,0,0],
            [5,0,0],
            [5,5,5],
        ],
        6:[
            [0,0,0],
            [0,0,6],
            [6,6,6],
        ],
        7:[
            [0,7,0,0],
            [0,7,0,0],
            [0,7,0,0],
            [0,7,0,0],
        ],
        }

        this.color = [
            '#86FB5D',
            '#EE88FF',
            '#FF9A3C',
            '#7661B1',
            '#FF5454',
            '#FAFF00',
            '#03E1E9'
        ]
    }

    /*colors() {
        const r = Math.floor(Math.random() * 101);;
        const g = Math.floor(Math.random() * 101);;
        const b = Math.floor(Math.random() * 101);;

        return `rgb(${r}, ${g}, ${b})`;
    }*/

    colors(){
        let number = Math.floor(Math.random() * 7) + 1;
        return this.color[number]
    }

    tetromino(){
        //console.log(this.figures);
        for (let index in this.figures){
            if (index == this.tipo){
                //console.log(this.tipo)
                //console.log(this.figures[this.tipo]);
                return this.figures[this.tipo]
            }
        }

        /*switch (this.tipo){
            case 1:return this.figures["1"];
        }*/
        /*if (this.tipo==1){
            let piece = this.figures["1"];
            //console.log(piece)
            return piece;
        }*/
    }

    tetrominoRandom(){
        let number = Math.floor(Math.random() * 7) + 1;
        //console.log(number);
        //console.log(this.figures[number])
        return this.figures[number]
    }
}

//let tetro = new Figuras().tetrominoRandom();
//console.log(tetro)
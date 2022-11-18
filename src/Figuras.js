class Figuras {
    constructor(){
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
            '#EB8FD0',
            '#FF904E',
            '#7ED958',
            '#FED16A',
            '#DC0C57',
            '#37B5FF',
            '#8B53FF'
        ]
    }

    colors(){
        let number = Math.floor(Math.random() * 7) + 1;
        return this.color[number]
    }

    tetromino(){
        for (let index in this.figures){
            if (index == this.tipo){
                return this.figures[this.tipo]
            }
        }
    }

    tetrominoRandom(){
        let number = Math.floor(Math.random() * 7) + 1;
        return this.figures[number]
    }
}


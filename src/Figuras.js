// Creación de clase Figuras
class Figuras {
    constructor(){
        //Declaración e inicialización de array asociativo para cada una de las figuras del tetronimo.
        //Para cada tetromino se establece una matriz con índices específicos que dibujarán la figura y asociará un color
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

        //Array de colores de las figuras
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

    //Método para retornar color aleatorio a las figuras
    colors(){
        /*Declaración e inicialización de variable a la cual se le asigna el resultado de una operación para determinar números aleatorios. Esta variable pasará a ser la posición del elemento en el arreglo de colores*/
        let number = Math.floor(Math.random() * 7) + 1;
        return this.color[number]
    }

    //Método para retornar tetronimo según el índice asignado
    tetromino(){
        for (let index in this.figures){
            if (index == this.tipo){
                return this.figures[this.tipo]
            }
        }
    }

    //Método que retorna un tetromino de manera aleatoria, en el que 'number', pasará a ser el índice en el arreglo de las figuras para posteriormente retornarla
    tetrominoRandom(){
        let number = Math.floor(Math.random() * 7) + 1;
        return this.figures[number]
    }
}


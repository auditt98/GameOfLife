//implementation of Conway's Game of Life
let sizeOfCell
var spawnRate = 0 //Must be from 0 to 1, anything above 1 will make
let game
let grid
let nCol = 70 // 10, 20, 40, 80, 100, 200, 400
let fps = 10

let randomColor = false
let fixedColor = {
    r: 0,
    g: 0,
    b: 0
}

//Canvas size / numCol(or row) -> width of each col 

function setup() {
    game = new Game()
    frameRate(fps);
    // createCanvas(windowWidth, windowHeight)
    let canvas = createCanvas(700, 700)
    sizeOfCell = Math.floor(width/nCol)
    print(sizeOfCell)
    // let canvas = createCanvas(1000, 1000)
    grid = new Grid()
    canvas.mousePressed(cMousePressed)
}

function draw() {
    background(255);
    grid.draw()
}

function cMousePressed(){
    // print(mouseX + ', ' + mouseY)
    // calculate column and row of clicked position
    var rect = canvas.getBoundingClientRect();
    var trueX = Math.floor((mouseX + window.pageXOffset) / sizeOfCell);
    var trueY = Math.floor((mouseY + window.pageYOffset + Math.floor(window.height - rect.bottom) + 8 ) / sizeOfCell);
    // let clickedCol = floor(mouseX/width * 10) 
    // let clickedRow = floor(mouseY/height * 10) 
    if(trueX <= nCol - 1 && trueY <= nCol - 1){
        grid.cells[trueX][trueY].state = 1
    }
}

function start(){
    game.state = 1
}

function pause(){
    game.state = 0
}

function reset(){
    game.generation = 0
    for(let col = 0; col < nCol; col++){
        for(let row = 0; row < nCol; row++){
            grid.cells[col][row].state = false
        }
    }
    pause()
}

function cClicked() {
    // var rect = canvas.getBoundingClientRect();
    // var left = Math.floor(rect.left + window.pageXOffset);
    // var top = Math.floor(rect.top + window.pageYOffset);
    // var cellSize = canvas.cellSize;
    // var clickEvent = {};
    // clickEvent.cellX = Math.floor((evt.clientX - left + window.pageXOffset) / cellSize);
    // clickEvent.cellY = Math.floor((evt.clientY - top + window.pageYOffset - 5) / cellSize); // TODO: Where's offset coming from?
    // fn(clickEvent);

}

class Game{
    constructor(){
        this.state = 0, //0 pause 1 pause
        this.generation = 0
    }

    updateGeneration(){
        if(this.state == 1){
            this.generation++
        }
        document.getElementById('gen').innerText = 'Generations: ' + this.generation
    }
}

class Grid{
    constructor(){
        this.numOfRows= Math.floor(width/sizeOfCell)
        this.numOfCols = Math.floor(width/sizeOfCell)
        this.cells = new Array(this.numOfCols)
        for(let i = 0; i < this.numOfCols; i++){
            this.cells[i] = new Array(this.numOfRows)
        }
        for(let col = 0; col < this.numOfCols; col++){
            for(let row = 0; row < this.numOfRows; row++){
                let a = new Cell(col, row)
                a.setCellState(a.randomCellState())
                this.cells[col][row] = a
            }
        }
    }

    draw(){
        game.updateGeneration()
        for(let col = 0; col < this.numOfCols; col++){
            for(let row = 0; row < this.numOfRows; row++){
                    this.cells[col][row].draw()
            }
        }
            this.updateNeighbour()
            if(game.state == 1){
                this.updateCellState()
            }
        }

        updateNeighbour(){
            for(let col = 0; col < this.numOfCols; col++){
                for(let row = 0; row < this.numOfRows; row++){
                    this.cells[col][row].getNeighbours()
                }
            }
        }

        updateCellState(){
            for(let col = 0; col < this.numOfCols; col++){
                for(let row = 0; row < this.numOfRows; row++){
                    this.cells[col][row].updateCellState()
                }
            }
        }


}

class Cell{
    //state 0 is dead, 1 is state
    constructor(col, row){
        this.row = row,
        this.col = col,
        this.state = false,
        this.gen = 0,
        this.neighbourCount = 0,
        this.color = this.setColor()
        
    }

    setColor(){
        //get a random color for a cell
        if(randomColor == true){
            return {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255)
            }
        } else{
            return fixedColor
        }

    }

    randomCellState(){
        var randomNumber = Math.random()
        if(randomNumber < spawnRate){
            return 1
        } else{
            return 0
        }
    }

    setCellState(state){
        if(state == true || state == 'true' || state == 1){
            this.state = true
        } else{
            this.state = false
        }
    }

    updateCellState(){
        if(this.state == true && (this.neighbourCount == 2 || this.neighbourCount == 3)){
            this.state = true
        }
        else if(this.state == false && this.neighbourCount == 3){
            this.state = true 
        }
        else{
            this.state = false
        }
        
    }

    getNeighbours(){
        //get 8 cells around it, then check if the object is valid or not
        //since cells on the boundaries will have less than 8 neighbours
        this.neighbourCount = 0
        for(let c = this.col - 1; c <= this.col + 1; c++){
            for(let r = this.row - 1; r <= this.row + 1; r++){
                if(c >= 0 && c <= nCol - 1 && r >= 0 && r <= nCol - 1 && (this.row != r || this.col != c )){ //nCol == nRow
                    if(grid.cells[c][r].state == true){
                        this.neighbourCount++
                    }
                }
            }
        }
    }

    draw(){
        // performance is super, super bad, can't handle grid larger than 100x100 well
        // this.getNeighbours()
        if(!this.state){
            noFill()
            stroke(1)
            strokeWeight(1)
        } else{
            noStroke()
            fill(this.color.r, this.color.g, this.color.b)
        }
        if(game.state == 1){
            // this.updateCellState()
        }
       

        rect(this.col * sizeOfCell, this.row * sizeOfCell, sizeOfCell, sizeOfCell)
    }

}



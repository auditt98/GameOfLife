//implementation of Conway's Game of Life
let sizeOfCell = 100
var spawnRate = 0.5 //Must be from 0 to 1, anything above 1 will make
var game //Not used yet
var grid
let nCol = 30
let nRow = 30
let randomColor = false
let fixedColor = {
    r: 0,
    g: 0,
    b: 0
}

function setup() {

    // createCanvas(windowWidth, windowHeight)
    createCanvas(nCol * sizeOfCell, nRow * sizeOfCell)
    grid = new Grid()
}

function draw() {
    background(255);
    grid.draw()
}

class Grid{
    constructor(){
        this.numOfRows= Math.floor(height/sizeOfCell)
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
        //invoke cell.draw() on every single cell
        for(let col = 0; col < this.numOfCols; col++){
            for(let row = 0; row < this.numOfRows; row++){
                this.cells[col][row].draw()
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
                if(c >= 0 && c <= nCol - 1 && r >= 0 && r <= nRow - 1 && (this.row != r || this.col != c )){
                    if(grid.cells[c][r].state == true){
                        this.neighbourCount++
                    }
                }
            }
        }
    }


    draw(){
        // performance is super, super bad, can't handle grid larger than 100x100 well
        this.updateCellState()
        this.getNeighbours()
        if(!this.state){
            noFill()
            stroke(1)
            strokeWeight(6)
        } else{
            noStroke()
            fill(this.color.r, this.color.g, this.color.b)
        }
        rect(this.col * sizeOfCell + 2, this.row * sizeOfCell + 2, sizeOfCell, sizeOfCell)
        // print('drawing')
        // textSize(20)
        // text(this.col + ', ' + this.row + ', ' + (this.state == true?1:0) + ', ' + this.neighbourCount, this.col * sizeOfCell + 2, this.row * sizeOfCell + sizeOfCell - 10)
    }

}



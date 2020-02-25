//implementation of Conway's Game of Life
let sizeOfCell
var spawnRate = 0 //Must be from 0 to 1, anything above 1 will make
let game
let grid
let nCol = 70 // 700
let fps = 10
let defaultFPS = fps
let randomPopulatedColor = false
let colorPopulated = "#000000"
let colorUnpopulated = "#ffffff"


//Canvas size / numCol(or row) -> width of each col 

function setup() {
    game = new Game()
    frameRate(fps)
    document.getElementById('speedInput').value = fps
    // createCanvas(windowWidth, windowHeight)
    let canvas = createCanvas(700, 700)
    sizeOfCell = Math.floor(width/nCol)
    print(sizeOfCell)
    document.getElementById('pauseButton').classList.add('button-error')
    // let canvas = createCanvas(1000, 1000)
    grid = new Grid()
    canvas.mousePressed(cMousePressed)
}

function draw() {
    background(255)
    frameRate(fps)
    grid.draw()
}

function cMousePressed(){
    // print(mouseX + ', ' + mouseY)
    // calculate column and row of clicked position
    // var rect = canvas.getBoundingClientRect();
    var trueX = Math.floor(((mouseX + window.pageXOffset) / sizeOfCell));
    var trueY = Math.floor(((mouseY + window.pageYOffset) / sizeOfCell));
    // var trueY = Math.floor((mouseY + window.pageYOffset + Math.floor(window.height - rect.bottom) + 8 ) / sizeOfCell); 
    if(trueX <= nCol - 1 && trueY <= nCol - 1){
        grid.cells[trueX][trueY].state = 1
    }
}


function changeSpeed() {
    let newFPS = Number(document.getElementById('speedInput').value)
    if(newFPS > 0){
        fps = newFPS
    } else{
        document.getElementById('speedInput').value = fps
    }
}

function resetSpeed() {
    fps = defaultFPS
    document.getElementById('speedInput').value = defaultFPS
}

function updatePopulatedColor(){
    let colorPickerPopulated = document.getElementById('populatedColor')
    colorPopulated ='#' + colorPickerPopulated.innerHTML
    colorPickerPopulated.style.backgroundColor = '#' + jscolor
}

function updateUnpopulatedColor(){
    let colorPickerUnpopulated = document.getElementById('unpopulatedColor')
    colorPickerUnpopulated.style.backgroundColor = '#' + jscolor
    colorUnpopulated = '#' + colorPickerUnpopulated.innerHTML
}

function updateRandomColor(){
    let randomColorCheckbox = document.getElementById('isRandomColor')
    if(randomColorCheckbox.checked == true){
        randomPopulatedColor = true
    } else{
        randomPopulatedColor = false
    }
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
        document.getElementById('gen').innerText = 'Thế hệ: ' + this.generation
    }

    setGameState(state){
        this.state = state
        let startButton = document.getElementById('startButton')
        let pauseButton = document.getElementById('pauseButton')
        if(this.state == 0){
            if(startButton.classList.contains('button-success')){
                startButton.classList.remove('button-success')
            }
            if(!pauseButton.classList.contains('button-error')){
                pauseButton.classList.add('button-error')
            }
        }
        if(this.state == 1){
            if(!startButton.classList.contains('button-success')){
                startButton.classList.add('button-success')
            }
            if(pauseButton.classList.contains('button-error')){
                pauseButton.classList.remove('button-error')
            }
        }
    }

    resetGameState(){
        this.generation = 0
        for(let col = 0; col < nCol; col++){
            for(let row = 0; row < nCol; row++){
                grid.cells[col][row].state = false
            }
        }
        this.setGameState(0)
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
        this.neighbourCount = 0
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
            fill(colorUnpopulated)
            stroke(1)
            strokeWeight(1)
        } else{
            noStroke()
            if(randomPopulatedColor){
                fill('#' +
                Math.floor(Math.random() * 255).toString(16) + 
                Math.floor(Math.random() * 255).toString(16) + 
                Math.floor(Math.random() * 255).toString(16))
            } else{
                fill(colorPopulated)
            }
        }
        rect(this.col * sizeOfCell, this.row * sizeOfCell, sizeOfCell, sizeOfCell)
    }

}



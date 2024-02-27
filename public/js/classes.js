
class GameBlock{
    constructor(ctx){
        this.ctx = ctx 
        this.fallingPiece = null // piece
        this.grid = this.makeStartingGrid()
        // console.log(this.grid)
    }

    makeStartingGrid(){
        let grid = [] 
        for (var i = 0; i < rows; i++){
            grid.push([])
            for (var j = 0; j < cols; j++){
                grid[grid.length - 1].push(0)
            }
        }
        return grid 
    }

    /* disallows colissions between blocks */
    collision(x, y, candidate=null){
        const shape = candidate || this.fallingPiece.shape 
        const n = shape.length 
        for (let i = 0; i < n; i++){
            for (let j = 0; j < n; j++){
                if (shape[i][j] > 0){
                    let p = x + j 
                    let q = y + i  
                    if (p >= 0 && p < cols && q < rows){
                        // in bounds
                        if (this.grid[q][p] > 0){
                            return true
                        }
                    } else {
                        return true
                    }
                }
            }
        }
        return false
    }

    /*  */
    renderGameState(){
        for (let i = 0; i < this.grid.length; i++){
            for (let j = 0; j < this.grid[i].length; j++){
                let cell = this.grid[i][j] 
                this.ctx.fillStyle = colors[cell] 
                this.ctx.fillRect(j, i, 1, 1)
            }
        }

        if (this.fallingPiece !== null){
            this.fallingPiece.renderPiece()
        }
    }

    /*  */
    moveDown(movement){
        if (this.fallingPiece === null){
            this.renderGameState() 
            return
        }else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)){ //checks if it has reached the bottom
            // console.log('hi')
            const shape = this.fallingPiece.shape 
            const x = this.fallingPiece.x 
            const y = this.fallingPiece.y 
            shape.map((row, i) => {
                row.map((cell, j) => {
                    let p = x + j 
                    let q = y + i 
                    if (p >= 0 && p < cols && q < rows && cell > 0){
                        this.grid[q][p] = shape[i][j] //fills the grid to avoid collision
                    }
                })
            })
            
            // check game over 
            if (this.fallingPiece.y === 0){
                const socket = io();
                
                socket.emit('game_over', {loser: $('#user_name').text()});                            
                this.grid = this.makeStartingGrid()
            }
            this.fallingPiece = null
        }else if(movement == 'drop'){ //drops to the base emmidiately
            this.fallingPiece.y += 1
            this.moveDown('drop')
        }else{
            this.fallingPiece.y += 1 //moves the block 1 step down
        }
        this.renderGameState()
    }

    /*  */
    move(right){
        if (this.fallingPiece === null){
            return
        }

        let x = this.fallingPiece.x 
        let y = this.fallingPiece.y 
        if (right){
            // move right
            if (!this.collision(x + 1, y)){
                this.fallingPiece.x += 1
            }
        } else {
            // move left
            if (!this.collision(x - 1, y)){
                this.fallingPiece.x -= 1
            }
        }
        this.renderGameState()
    }

    /*  */
    rotate(){
        if (this.fallingPiece !== null){
            let shape = [...this.fallingPiece.shape.map((row) => [...row])]
            // transpose of matrix 
            for (let y = 0; y < shape.length; ++y){
                for (let x = 0; x < y; ++x){
                    [shape[x][y], shape[y][x]] = 
                    [shape[y][x], shape[x][y]]
                }
            }
            // reverse order of rows 
            shape.forEach((row => row.reverse()))
            if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)){
                this.fallingPiece.shape = shape
            }
        }
        this.renderGameState()
    }
}

class Piece {
    constructor(shape, ctx){
        this.shape = shape 
        this.ctx = ctx 
        this.y = 0 //starts the block from row 0
        this.x = Math.floor(cols / 2) //starts the block from middle column
    }

    renderPiece(){
        this.shape.map((row, i) => {
            row.map((cell, j) => {
                if (cell > 0){
                    this.ctx.fillStyle = colors[cell] 
                    this.ctx.fillRect(this.x + j, this.y + i, 1, 1)
                }
            })
        })
    }
}

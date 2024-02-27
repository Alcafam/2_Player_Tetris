/* This defines the:
    setup of the game
*/
function functionalities(ctx, opponent_ctx){
    const socket = io();
    let score = 0 
    // opponent_ctx.scale(block_side_length, block_side_length)
    //scales the canvas para yung blocks ay tama lang ang pag fit every drop
    ctx.scale(block_side_length, block_side_length) 
    opponent_ctx.scale(block_side_length, block_side_length)
    let block = new GameBlock(ctx) //creates class that will cater the blocks
    let opponent = new GameBlock(opponent_ctx);

    setInterval(() => {
        newGameState(block)
    }, game_clock); 


    let newGameState = (block) => {
        fullSend(); //checks if a row is completed
        const rare = [0, 1, 6];
        if (block.fallingPiece === null){ //if falling block already reached the bottom
            const rarity = Math.floor(Math.random() * (4 - 1 + 1)+1)  //random block will be given
            let rand;
            if(rarity == 1){
                rand =  rare[Math.floor(Math.random() * (2 - 1)+1)]
            }else{
                rand = Math.floor(Math.random() * (6 - 2)+2)
            }
            const newPiece = new Piece(shapes[rand], ctx)  
            block.fallingPiece = newPiece 
            block.moveDown()
            socket.emit('broadcast_state', rand);
        } else {
            block.moveDown();
            opponent.moveDown();
        }
    }
    socket.on('broadcasted_newGameState', function(block){
        opponent.fallingPiece = new Piece(shapes[block], opponent_ctx)
        opponent.moveDown()
    })

    socket.on('broadcasted_grid', function(i){
        console.log('haha')
        opponent.grid.splice(i, 1) 
        opponent.grid.unshift([0,0,0,0,0,0,0,0,0,0])
    })

    socket.on('broadcasted_move', function(move){
        // console.log(move);
        switch(move){
            case 'ArrowUp':
                opponent.rotate() 
                break 
            case "ArrowRight":
                opponent.move(true) 
                break 
            case "ArrowDown": 
                opponent.moveDown() 
                break 
            case "ArrowLeft":
                opponent.move(false) 
                break
            case 'space':
                opponent.moveDown('drop')
                break
        }
    })
    /* Checks the row if it is filled then scores*/
    const fullSend = () => {
        const allFilled = (row) => {
            for (let x of row){
                if (x === 0){
                    return false
                }
            }
            return true
        }

        // if completed, resets the row
        for (let i = 0; i < block.grid.length; i++){
            if (allFilled(block.grid[i])){
                score += score_worth 
                block.grid.splice(i, 1) 
                block.grid.unshift([0,0,0,0,0,0,0,0,0,0])
                socket.emit('broadcast_grid', i);
            }
        }
        $('#scoreboard').html("Score: " + String(score));
    }
    
        /* Arrow Key events - moves blocks depending on moves */
    document.addEventListener("keydown", (e) => {
        // console.log(e.key)
        e.preventDefault() 
        switch(e.key){
            case 'ArrowUp':
                socket.emit('broadcast_move', 'ArrowUp');
                block.rotate() 
                break 
            case "ArrowRight":
                socket.emit('broadcast_move', 'ArrowRight');
                block.move(true) 
                break 
            case "ArrowDown": 
            socket.emit('broadcast_move', 'ArrowDown');
                block.moveDown() 
                break 
            case "ArrowLeft":
                socket.emit('broadcast_move', 'ArrowLeft');
                block.move(false) 
                break
            case ' ':
                socket.emit('broadcast_move', 'space');
                block.moveDown('drop')
                break
        }

        
    })
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = app.listen(8000);
const io = require('socket.io')(server);
const public_folder = __dirname + "/public";

let users=[];
let client_ids =[];
let allClients = [];
let ids=[];

//use body parser
app.use(bodyParser.urlencoded({extended: true}));
// this is the line that tells our server to use the "/static" folder for static content
app.use(express.static(public_folder));

function listSocketsProperty(myProperty){
    let sck = io.sockets.sockets
    const mapIter = sck.entries()
    let result = [];
    while(1){
      let en = mapIter.next().value?.[0]
      if(en) {
        result.push(sck.get(en)[myProperty])
      }else 
        break
    }
    return result;
}

function remove_duplicates(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

// socket events
io.on('connection', function (socket){
    socket.emit('new_connection');
    
    //max of 2 users only
    socket.on('new_user', function (data){
        if(users.length<2){
            users.push(data.name);
            client_ids.push(socket.id)
            
            allClients.push(socket);
            if(socket.id == allClients[0].id){
                socket.username = 'yes';
            }else{
                socket.username = 'no';
            }
            socket.emit('entered_room', {name: data.name, host:socket.username})
            socket.broadcast.emit('new_user_entered', {name: data.name, host:socket.username})
        }else{
            socket.emit('2_players_only')
        }
        console.log(client_ids)
        console.log('current: ' + allClients.length)
    })

    socket.on('start', function(){
        io.sockets.emit('all_start');

    })

    socket.on('broadcast_state', function(block){
        socket.broadcast.emit('broadcasted_newGameState', block);
    })

    socket.on('broadcast_move', function(move){
        socket.broadcast.emit('broadcasted_move', move);
    })

    socket.on('broadcast_grid', function(i){
        socket.broadcast.emit('broadcasted_grid', i);
    })

    socket.on('game_over', function(data){
        console.log(data.loser)
        let loser = data.loser.replace("Player ", "");
        loser = loser.replace(" ", "");
        let winner = users.indexOf(loser);
        socket.broadcast.emit('over', {winner: users[winner]});
    })  

    /*when user disconnects */
    socket.on('disconnected', function (){ 
        ids = listSocketsProperty('id');
        
        ids = remove_duplicates(ids);
        let difference = client_ids.filter(x => !ids.includes(x));

        for(var i in allClients){
            for(var x in difference){
                if(allClients[i].id == difference[x]){
                    removed_user = users.splice(i, 1);
                    allClients.splice(i, 1);
                }
            }
        }
        if(client_ids.length == 0){
            client_ids=[];
            users=[];
        }
    })
})

console.log('Server is listening on port 8000');
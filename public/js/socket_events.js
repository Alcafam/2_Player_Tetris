$(document).ready(function(){
    const socket = io();
    socket.emit('disconnected');
    socket.on('new_connection', function (){
        $('#new_connection_modal').modal({backdrop: 'static', keyboard: false})  
        $('#new_connection_modal').modal('show');
    });

    socket.on('2_players_only', function (){
        $('#new_connection_modal').modal('hide');
        $('#sorry_modal').modal({backdrop: 'static', keyboard: false})  
        $('#sorry_modal').modal('show');
    });
    
    socket.on('entered_room', function (data){
        $('#new_connection_modal').modal('hide');
        if(data.host === 'yes'){
            $('#options').append(
                '<button class="btn btn-success mt-3 my-1" id="start_game">Start</button>'
            );
            $('#user_name').append('Player <span style="font-weight:600">' + data.name + '</span>')
        }else{
            $('#user_name').append('Player <span style="font-weight:600">' + data.name + '</span>')
        }
    })

    socket.on('new_user_entered', function (data){
        $('#opponent_user_name').append('Player <span style="font-weight:600">' + data.name + '</span>')
    })

    socket.on('all_start', function(){
        /* get context of own canvas 
            this part is taken from the internet...haha the idea of getContent
        */
        let ctx = $('#game_canvas').get(0).getContext('2d');
        let opponent_ctx = $('#opponent_game_canvas').get(0).getContext('2d');
        functionalities(ctx, opponent_ctx);
    })

    socket.on('over', function(data){
        // alert("Game over! "+data.winner+" won!") 
        $('#sorry_modal').modal({backdrop: 'static', keyboard: false})  
        $('#message').text("Game over! "+data.winner+" won!")
        $('#sorry_modal').modal('show');
        $('#game_canvas').remove();
        $('#opponent_game_canvas').remove();
    }) 

    $('#new_user').submit(function( event ) {
        if($('#name').val()!='' || $('#name').val()!= 'undefined' || $('#name').val()!=null){
            socket.emit('new_user', {name:$('#name').val()});
        }       
        return false;         
    });

    $(document).on('click', '#start_game', function(){
        $('#start_game').addClass('d-none');

        socket.emit('start');
    })

})
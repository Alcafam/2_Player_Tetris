/* This defines the:
    block dimensions in px
    canvas dimensions in px
    numbers of rows and columns in canvas
    speed of dropdowns
    this part was an idea from a source in the internet and from hacker hero pre requisite module
*/
    const game_clock = 1000 //1 second
    const block_side_length = 30 
    const rows = 20 
    const cols = 10 
    const score_worth = 10 

    const shapes = [
        [],
        [ //long block
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ], 

        [ //L block
            [2,0,0],
            [2,2,2],
            [0,0,0],
        ],

        [ //L block
            [0,0,3],
            [3,3,3],
            [0,0,0],
        ],

        [ //square block
            [4,4],
            [4,4],
        ],

        [ //Z block
            [0,5,5],
            [5,5,0],
            [0,0,0],
        ],

        [ //T block
            [0,6,0],
            [6,6,6],
            [0,0,0],
        ],

        [ //Z block
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ],

    ]

    const colors = [
        '#000000', // canvas background
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#17a2b8',
        '#ffc107',
        '#28a745',
        '#ffc107'
    ]
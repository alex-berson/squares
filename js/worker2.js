importScripts('utils.js');
importScripts('mcts.js');
importScripts('minimax.js');
importScripts('simpleai.js');

let player, dashSquares;

addEventListener("message", e => {
    
    let [dashes, squares, color] = e.data;

    player = color;

    dashSquares = findAjacentSquares();

    // let dash = player == blue ? mcts(dashes, squares) : minimax(dashes, squares)[0];

    // let dash = mcts(dashes, squares);

    // let [dash, _] = minimax(dashes, squares);

    // let dash = simpleAI(dashes, squares);

    // console.log(dashes, squares);

    let dash;

    // let dash = oneSide(dashes, squares) != null ? mcts(dashes, squares) : minimax(dashes, squares)[0];

    // if (player == blue) {

        // console.log("MINIMAX");

        dash = minimax(dashes, squares)[0];

        // dash = mcts(dashes, squares);


    // } else {

    //     dash = oneSide(dashes, squares);

    //     if (dash != null) {
    //         // console.log("MCTS");
    //         dash = mcts(dashes, squares);
    //     } else {
    //         // console.log("MINIMAX");
    //         dash = minimax(dashes, squares)[0];
    //     }
    // }

    // console.log(dash);
    
    postMessage(dash);

    close();
});
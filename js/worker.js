importScripts('utils.js');
importScripts('mcts.js');
importScripts('minimax.js');

let player;
let dashSquares;

addEventListener("message", e => {
    
    let [dashes, squares, color] = e.data;

    player = color;

    dashSquares = findAjacentSquares();

    let dash = player == blue ? minimax(dashes, squares)[0] : mcts(dashes, squares);


    // let dash = mcts(dashes, squares);

    // let [dash, _] = minimax(dashes, squares);

    // console.log(dashes, squares);

    // console.log(dash);
    
    postMessage(dash);

    close();
});
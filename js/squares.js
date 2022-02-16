let dashes = [];
let squares = [];
let dashSquares = [];

let size = 3;
let depth = 1;
let blue = 1;
let pink = 2;
let player = blue;

let turnInterval;   //
let turn = 0;   //

let scores = [];    //

let bluesW = 0; //
let pinksW = 0; //

const touchScreen = () => matchMedia('(hover: none)').matches;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const changeColor = () => player == blue ? player = pink : player = blue;

const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

const win = (squares) => squares.blue + squares.pink == 9 ? true : false;

const shuffle = (arr) => {

    let array = arr.slice();

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const copyBoard = (dashes, squares) => {

    let newDashes = dashes.slice();
    let newSquares = squares.slice();

    newSquares.blue = squares.blue;
    newSquares.pink = squares.pink;

    return [newDashes, newSquares];
}

const updateBoard = (dash, dashes, squares, color) => {

    let filled = false;

    dashes[dash] = player;

    for (let n of dashSquares[dash]) {

        squares[n]++;

        if (squares[n] == 4) {
            color == blue ? squares.blue++ : squares.pink++;
            filled = true;
        }
    }

    return filled;
}

const aiTurn = (delay = 0) => {

    // let dash

    depth = 1;

    // let dash = randomAI(dashes);

    // let dash = simpleAI(dashes, squares);

            // dash = mcs(dashes, squares, startTime, timeLimit);


    // if (player == blue) {

        // dash = mcts(dashes, squares);

        
        let [dash, _] = minimax(dashes, squares, delay);


    // } else {

        // dash = mcs(dashes, squares);

    // }

    console.log(dash);

    if (dash == null) return;

    let dashEl = getDashEl(dash);

    select(dashEl);

    if (updateBoard(dash, dashes, squares, player)) {

        fillSquares(dash);

        // if (win(squares)) {
        //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
        //     console.log(turn++, bluesW, pinksW);
        //     clearInterval(turnInterval);
        //     initBoard();
        //     setTimeout(rePlay, 2000);
        // }

        setTimeout(aiTurn, 0, 500); //
        return;
    }
    
    // if (win(squares)) {
    //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
    //     console.log(turn++, pinksW, pinksW);
    //     clearInterval(turnInterval);
    //     initBoard();
    //     setTimeout(rePlay, 2000);
    // }

    changeColor();
    setTimeout(enableTouch, 500);
} 

const humanTurn = (e) => {

    let dashEl = e.currentTarget;

    if (select(dashEl)) {

        let dash = getDash(dashEl);

        disableTouch();

        if (!updateBoard(dash, dashes, squares, player)) {

            changeColor();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(aiTurn, 0);
                });
            }); 
        
            return;
        }

        fillSquares(dash);

        enableTouch();
    }
}

const rePlay = () => {

    player = blue;

    clearBoard();

    setTimeout(() => {turnInterval = setInterval(aiTurn, 1000)}, 1000);
}

const findAjacentSquares = () => {

    let dashSquares = [];

    for (let i = 0; i < dashes.length; i++) {

        if (i < size) dashSquares.push([i]);
        if (i >= size && i < size * size) dashSquares.push([i - size, i]);
        if (i >= size * size && i < size * (size + 1)) dashSquares.push([i - size]);
        if (i >= size * (size + 1) && i % (size + 1) == 0) dashSquares.push([i - size * (size + 1) - (i - size * (size + 1)) / (size + 1)]);
        if (i >= size * (size + 1) && i % (size + 1) != 0 && (i + 1) % (size + 1) != 0) dashSquares.push([i - size * (size + 1) - 1 - Math. floor((i - size * (size + 1)) / (size + 1)), i - size * (size + 1) - Math. floor((i - size * (size + 1)) / (size + 1))]);
        if (i >= size * (size + 1) && (i + 1) % (size + 1) == 0) dashSquares.push([i - size * (size + 1) - 1 - (i - size * (size + 1) - size) / (size + 1)]);
    }

    return dashSquares;
}

const initBoard = () => {

    dashes = [];
    squares = [];
    // dashSquares = [[0],[1],[2],[0,3],[1,4],[2,5],[3,6],[4,7],[5,8],[6],[7],[8],[0],[0,1],[1,2],[2],[3],[3,4],[4,5],[5],[6],[6,7],[7,8],[8]];

    squares.blue = 0;
    squares.pink = 0;

    for (let i = 0; i < size * (size + 1) * 2; i++) {
        dashes.push(0);
    }

    for (let i = 0; i < size * size; i++) {
        squares.push(0);
    }

    dashSquares = findAjacentSquares();

    // console.log(dashSquares);
    // console.log(findSquares());

    // dashes[8] = 0;
    // dashes[11] = 0;
    // squares[5] = 3;
    // squares[8] = 2;
}

const init = () => {

    disableTapZoom();
    initBoard();
    showBoard();
    enableTouch();

    setTimeout(() => {
        player = 2;
        aiTurn();
    }, 1000);

//    turnInterval = setInterval(aiTurn, 1000);
}

window.onload = () => {
    document.fonts.ready.then(() => {
            init();     
    });
}
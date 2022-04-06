let dashes = [];
let squares = [];
let dashSquares = [];

let playerColor;
let player;

let turnInterval;   //
let turn = 0;   //

let scores = [];    //

let bluesW = 0; //
let pinksW = 0; //

let cut = false;    //

const gameOver = () => {

    console.log("GAME OVER");

    document.querySelector('.board').classList.add("reset");

    setTimeout(() => {
        if (touchScreen()){
            document.querySelector('.board').addEventListener("touchstart", newGame);
        } else {
            document.querySelector('.board').addEventListener("mousedown", newGame);
        }
    }, 500);
}

const newGame = () => {

    console.log("NEW GAME");

    document.querySelector('.board').classList.remove("reset");

    if (touchScreen()){
        document.querySelector('.board').removeEventListener("touchstart", newGame);
    } else {
        document.querySelector('.board').removeEventListener("mousedown", newGame);
    }

    playerColor = playerColor == blue ? pink : blue;
    player = playerColor;

    initBoard();

    clearBoard();

    if (playerColor == localStorage.getItem("color")) {
        setTimeout(enableTouch, 500);
        return;
    }   

    // setTimeout(() => {
        // requestAnimationFrame(() => {
            // requestAnimationFrame(() => {
                aiTurn();
            // });
        // });
    // }, 1000);
}

const rePlay = () => {

    playerColor = playerColor == blue ? pink : blue;
    player = playerColor;

    // player = blue;

    clearBoard();

    setTimeout(() => {turnInterval = setInterval(aiTurn, 1500)}, 1000);
}

const aiTurn = () => {

    // let dash

    // depth = 1;

    const worker = new Worker("./js/worker.js");

    worker.postMessage([dashes, squares, player]);

    worker.addEventListener("message", e => {

        let [dash, i] = e.data;

        // console.log(e.data);

        // alert(i);

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

            if (win(squares)) {
                setTimeout(gameOver, 1000); 
            } else {
                setTimeout(aiTurn, 500); //
            }

            return;
        }
        
        // if (win(squares)) {
        //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
        //     console.log(turn++, pinksW, pinksW);
        //     clearInterval(turnInterval);
        //     initBoard();
        //     setTimeout(rePlay, 2000);
        // }

        if (win(squares)) {
            setTimeout(gameOver, 1000); 
            return;
        } 

        changeColor();
        setTimeout(enableTouch, 500);
    });
} 

const humanTurn = (e) => {

    let dashEl = e.currentTarget;

    if (select(dashEl)) {

        let dash = getDash(dashEl);

        disableTouch();

        // console.log(player);

        if (!updateBoard(dash, dashes, squares, player)) {

            if (win(squares)) {
                setTimeout(gameOver, 1000); 
                return;
            } 

            changeColor();

            // requestAnimationFrame(() => {
                // requestAnimationFrame(() => {
                    // setTimeout(aiTurn, 500);
                    setTimeout(aiTurn, 0);

                // });
            // }); 
        
            return;
        }

        fillSquares(dash);

        if (win(squares)) {
            setTimeout(gameOver, 1000); 
            return;
        } 

        enableTouch();
    }
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

    if (localStorage.color) {

        playerColor = parseInt(localStorage.getItem("color"));
        player = playerColor;

        showBoard();
        enableTouch();
    } else {
        showChoice();

        setTimeout(enableTouchChoice, 2000);
    }

    // setTimeout(() => {
    //     player = pink;
    //     aiTurn();
    // }, 1000);

//    turnInterval = setInterval(aiTurn, 1500); //
}

window.addEventListener('load', () => document.fonts.ready.then(() => init()));

// window.onload = () => {
//     document.fonts.ready.then(() => {
//             init();     
//     });
// }
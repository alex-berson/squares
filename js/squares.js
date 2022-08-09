let dashes = [];
let squares = [];
let dashSquares = [];

let playerColor, player;

let turnInterval;   //
let turn = 0;   //

let scores = [];    //

let bluesW = 0; //
let pinksW = 0; //

let cut = false;    //

let queue = []; //

let worker1, worker2, worker3, worker4, worker5, worker6, worker7; //

let input = 
[12, 4, 15, 13, 6, 18, 20, 8, 22, 7, 17, 2, 11, 23, 0, 3, 16, 21, 9, 10, 19, 5, 14, 1]

// console.log(worker1, worker4);



const storeColor = (color) =>  localStorage.setItem("color", color);

const gameOver = () => {

    // console.log("GAME OVER");

    showWinner();

    setTimeout(() => {

        document.querySelector('.board').classList.add("reset");

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

    setTimeout(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        });
    }, 500);
}

const rePlay = () => {

    queue = []; 

    playerColor = playerColor == blue ? pink : blue;
    player = playerColor;

    // player = blue;

    clearBoard();

    // setTimeout(() => {turnInterval = setInterval(aiTurn, 1500)}, 0);

    setTimeout(aiTurn, 1000);

}

const aiTurn = () => {

    let dash
    let timeLimit = 500;

    depth = 1;

    // let dash = randomAI(dashes);

    // let dash = simpleAI(dashes, squares);

            // dash = mcs(dashes, squares, startTime, timeLimit);


    if (player == blue) {

        // if (oneSide(dashes, squares)) {
        //     console.log("MCTS");
        [dash, _] = minimax(dashes, squares, timeLimit);

        // [dash, _] = mcts(dashes, squares);

        // } else {
        //     console.log("MINIMAX");
        //     [dash, _] = minimax(dashes, squares);
        // }

        // if (cut) console.log("CUT");    //

        // cut = false;    //


        


    } else {

        // [dash, _] = mcts(dashes, squares);


        [dash, _] = minimax(dashes, squares, timeLimit);
    }

    // console.log(dash);

    if (dash == null) return;

    queue.push(dash); //

    dash = input.shift();

    let dashEl = getDashEl(dash);

    select(dashEl);

    if (updateBoard(dash, dashes, squares, player)) {

        fillSquares(dash);

        // if (win(squares)) {
        //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
        //     if (checkPattern()) console.log([...queue]);
        //     console.log(turn++, bluesW, pinksW, squares.blue, squares.pink);
        //     clearInterval(turnInterval);
        //     initBoard();
        //     setTimeout(rePlay, 2000);
        //     return;
        // }

        if (win(squares)) {
            if (checkPattern()) console.log([...queue]);
            setTimeout(gameOver, 500); 
        } else {
            // setTimeout(aiTurn, 1000); //
        }

        setTimeout(aiTurn, 1000); //

        return;
    }
    
    // if (win(squares)) {
    //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
    //     if (checkPattern()) console.log([...queue]);
    //     console.log(turn++, bluesW, pinksW, squares.blue, squares.pink);
    //     clearInterval(turnInterval);
    //     initBoard();
    //     setTimeout(rePlay, 2000);
    //     return;
    // }

    if (win(squares)) {
        if (checkPattern()) console.log([...queue]);
        setTimeout(gameOver, 500); 
        return;
    } 

    changeColor();
    setTimeout(enableTouch, 250);

    setTimeout(aiTurn, 500); //

} 

const aiTurn2 = () => {

    // let dash, i;

    let move = {};

    let counter = 0;

    const makeMove = () => {

        // console.log("MAKEMOVE");

        // console.log(move.end);

        let dash = move.terminal ? move.minimax : move.mcts;

        console.log(dash);

            // console.log(i, player);

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
                //     document.querySelector('h1').innerText = String(bluesW) + " " + String(pinksW);
                //     initBoard();
                //     setTimeout(rePlay, 2000);
                // }
    
                if (win(squares)) {
                    setTimeout(gameOver, 500); 
                } else {
                    setTimeout(aiTurn, 500); //
                }
    
                return;
            }
            
            // if (win(squares)) {
            //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
            //     console.log(turn++, pinksW, pinksW);
            //     clearInterval(turnInterval);
            //     document.querySelector('h1').innerText = String(bluesW) + " " + String(pinksW);
            //     initBoard();
            //     setTimeout(rePlay, 2000);
            // }
    
            if (win(squares)) {
                setTimeout(gameOver, 1000); 
                return;
            } 
    
            changeColor();
            setTimeout(enableTouch, 250);

    }

    if (player == blue) {

        let [dash, i] = minimax(dashes, squares, 500);

        move.minimax = dash[0];

        move.terminal = true;

        makeMove();

        // const worker1 = new Worker("./js/worker_minimax.js");

        // // if (worker1 == undefined) worker1 = new Worker("./js/worker_minimax.js");

        // worker1.postMessage([dashes, squares, player, 500]);

        // worker1.addEventListener("message", e => {

        //     // worker1.terminate();
             
        //     // console.log("WORKER2");

        //     let [dash, i] = e.data;

        //     // console.log(dash, i);

        //     move.minimax = dash;
        //     move.terminal = freeDashes(dashes).length <= i;

        //     move.terminal = true;

        //     // console.log(move.terminal);
            
        //     // counter++;

        //     // if (counter == 2) makeMove();

        //     makeMove();

        //     // console.log(i, freeDashes(dashes).length, player);

        //     // if (freeDashes(dashes).length <= i) mcts = false;

        // }, {once: true});

        // const worker2 = new Worker("./js/worker_mcts.js");

        // // if (worker2 == undefined) worker2 = new Worker("./js/worker_mcts.js");

        // worker2.postMessage([dashes, squares, player]);

        // worker2.addEventListener("message", e => {

        //     // worker2.terminate();

        //     // console.log("WORKER1");

        //     // console.log(e.data);

        //     // console.log(dash);

        //     // while (dash == undefined) {};

        //     let [dash, i] = e.data;

        //     // console.log(dash, i);


        //     move.mcts = dash;

        //     counter++;

        //     if (counter == 2) makeMove();            
           
        // }, {once: true});

    // console.log(webWorkers());


    } else {

        const worker3 = new Worker("./js/worker_minimax.js");

        // if (worker3 == undefined) worker3 = new Worker("./js/worker_minimax.js");

        worker3.postMessage([dashes, squares, player, 500]);

        worker3.addEventListener("message", e => {

            // worker3.terminate();

            // console.log(e.data);
    
            let [dash, i] = e.data;

            // console.log(i, player);

    
    
            // alert(i);
    
           move.minimax = dash;
           move.terminal = true;

           makeMove();   
        }, {once: true});

        // console.log("END");
    }

    
}

const humanTurn = (e) => {

    let dashEl = e.currentTarget;

    if (select(dashEl)) {

        let dash = getDash(dashEl);

        disableTouch();

        // console.log(player);

        if (!updateBoard(dash, dashes, squares, player)) {

            if (win(squares)) {
                setTimeout(gameOver, 500); 
                return;
            } 

            changeColor();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(aiTurn, 500);
                });
            }); 
        
            return;
        }

        fillSquares(dash);

        if (win(squares)) {
            setTimeout(gameOver, 500); 
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

const setColor = () => {
    playerColor = parseInt(localStorage.getItem("color"));

    // console.log(playerColor);

    player = playerColor;

    setHeaderColors(playerColor);
}

const checkColor = () => {

    if (localStorage.color) {
        setColor();
        showChoice(false);
        setTimeout(enableTouchChoice, 0);

        // showBoard();
        // enableTouch();
    } else {
        showChoice(true);
        setTimeout(enableTouchChoice, 250);
    }
}

const webWorkers = () => {
    if (worker1 == undefined) worker1 = new Worker("./js/worker_minimax.js");
    if (worker2 == undefined) worker2 = new Worker("./js/worker_mcts.js");
    // if (worker3 == undefined) worker3 = new Worker("./js/worker_minimax.js");
    // if (worker4 == undefined) worker4 = new Worker("./js/worker_minimax.js");
    // if (worker5 == undefined) worker5 = new Worker("./js/worker_minimax.js");
    // if (worker6 == undefined) worker6 = new Worker("./js/worker_minimax.js");
    // if (worker7 == undefined) worker7 = new Worker("./js/worker_minimax.js");

}

const init = () => {

    disableTapZoom();
    initBoard();
    // webWorkers();
    checkColor();

    // showBoard();
    // setPattern(); //

    // if (localStorage.color) {

    //     playerColor = parseInt(localStorage.getItem("color"));
    //     player = playerColor;

    //     showBoard();
    //     enableTouch();
    // } else {
    //     showChoice();

    //     setTimeout(enableTouchChoice, 2000);
    // }

    setTimeout(() => {
        player = blue;
        // aiTurn();

        setTimeout(aiTurn, 1500);

        // turnInterval = setInterval(aiTurn, 1500); //

    }, 3000);

    // turnInterval = setInterval(aiTurn, 1500); //


}

window.onload = document.fonts.ready.then(init());

// window.onload = () => {
//     document.fonts.ready.then(() => {
//             init();     
//     });
// }
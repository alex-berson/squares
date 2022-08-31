const blue = 1;
const pink = 2;
const size = 3;
let dashes = [];
let squares = [];
let dashSquares = [];
let player, playerColor;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service worker registered!', reg);
            })
            .catch(err => {
                console.log('Service worker registration failed: ', err);
            });
    });
}

const changeColor = () => player == blue ? player = pink : player = blue;

const win = (squares) => squares.blue + squares.pink == size * size ? true : false;

const winner = (squares) => squares.blue > squares.pink ? blue : pink;

const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

const storeColor = (color) =>  localStorage.setItem("color", color);

const shuffle = (arr) => {

    let array = arr.slice();

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const findAjacentSquares = () => {

    let dashSquares = [];

    for (let i = 0; i < size * (size + 1) * 2; i++) {

        if (i < size) dashSquares.push([i]);
        if (i >= size && i < size * size) dashSquares.push([i - size, i]);
        if (i >= size * size && i < size * (size + 1)) dashSquares.push([i - size]);
        if (i >= size * (size + 1) && i % (size + 1) == 0) dashSquares.push([i - size * (size + 1) - (i - size * (size + 1)) / (size + 1)]);
        if (i >= size * (size + 1) && i % (size + 1) != 0 && (i + 1) % (size + 1) != 0) dashSquares.push([i - size * (size + 1) - 1 - Math. floor((i - size * (size + 1)) / (size + 1)), i - size * (size + 1) - Math. floor((i - size * (size + 1)) / (size + 1))]);
        if (i >= size * (size + 1) && (i + 1) % (size + 1) == 0) dashSquares.push([i - size * (size + 1) - 1 - (i - size * (size + 1) - size) / (size + 1)]);
    }

    return dashSquares;
}

const copyBoard = (dashes, squares) => {

    let newDashes = dashes.slice();
    let newSquares = squares.slice();

    newSquares.blue = squares.blue;
    newSquares.pink = squares.pink;

    return [newDashes, newSquares];
}

const freeDashes = (dashes) => {

    let seq = [];

    for (let i = 0; i < dashes.length; i++) {

        if (dashes[i] == 0) seq.push(i);
    }

    return seq;
}

const updateBoard = (dash, dashes, squares, color) => {

    let completed = false;

    dashes[dash] = color;

    for (let n of dashSquares[dash]) {

        squares[n]++;

        if (squares[n] == 4) {
            color == blue ? squares.blue++ : squares.pink++;
            completed = true;
        }
    }

    return completed;
}

const gameOver = () => {

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

const aiTurn = () => {

    let dash
    let timeLimit = 500;

    depth = 1;
    
    dash = minimax(dashes, squares, timeLimit);

    if (dash == null) return;

    let dashEl = getDashEl(dash);

    select(dashEl);

    if (updateBoard(dash, dashes, squares, player)) {

        fillSquares(dash);

        if (win(squares)) {
            setTimeout(gameOver, 500); 
            return;
        }
        
        setTimeout(aiTurn, 1000);
        return;
    }

    if (win(squares)) {
        setTimeout(gameOver, 500); 
        return;
    } 

    changeColor();
    setTimeout(enableTouch, 250);
} 

const humanTurn = (e) => {

    let dashEl = e.currentTarget;

    if (select(dashEl)) {

        let dash = getDash(dashEl);

        disableTouch();

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

    squares.blue = 0;
    squares.pink = 0;

    for (let i = 0; i < size * (size + 1) * 2; i++) {
        dashes.push(0);
    }

    for (let i = 0; i < size * size; i++) {
        squares.push(0);
    }

    dashSquares = findAjacentSquares();
}

const setColor = () => {

    playerColor = parseInt(localStorage.getItem("color"));
    player = playerColor;

    setHeaderColors(playerColor);
}

const checkColor = () => {

    if (localStorage.color) {
        setColor();
        showChoice(false);
        setTimeout(enableTouchChoice, 0);
    } else {
        showChoice(true);
        setTimeout(enableTouchChoice, 250);
    }
}

const init = () => {

    disableTapZoom();
    initBoard();
    checkColor();
}

window.onload = document.fonts.ready.then(init());
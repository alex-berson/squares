let blue = 1;
let pink = 2;
let size = 3;
let player, firstPlayer;
let dashes, squares, dashSquares;

const togglePlayer = () => player = player == blue ? pink : blue;

const gameOver = (squares) => squares.blue + squares.pink == size ** 2;

const shuffle = (arr) => {

    for (let i = arr.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }

    return arr;
}

const initBoard = () => {

    dashes = [];
    squares = [];
    squares.blue = 0;
    squares.pink = 0;

    for (let i = 0; i < size * (size + 1) * 2; i++) {
        dashes.push(0);
    }

    for (let i = 0; i < size ** 2; i++) {
        squares.push(0);
    }

    dashSquares = findAjacentSquares();
}

const copyBoard = (dashes, squares) => {

    let newDashes = dashes.slice();
    let newSquares = squares.slice();

    newSquares.blue = squares.blue;
    newSquares.pink = squares.pink;

    return [newDashes, newSquares];
}

const getFreeDashes = (dashes) => {

    let freeDashes = [];

    for (let i = 0; i < dashes.length; i++) {

        if (dashes[i] == 0) freeDashes.push(i);
    }

    return freeDashes;
}

const updateBoard = (dash, dashes, squares, color) => {

    let completed = false;

    dashes[dash] = color;

    for (let i of dashSquares[dash]) {

        squares[i]++;

        if (squares[i] == 4) {
            color == blue ? squares.blue++ : squares.pink++;
            completed = true;
        }
    }

    return completed;
}

const findAjacentSquares = () => {

    let dashSquares = [];

    for (let i = 0; i < size * (size + 1) * 2; i++) {

        if (i < size) dashSquares.push([i]);
        if (i >= size && i < size ** 2) dashSquares.push([i - size, i]);
        if (i >= size ** 2 && i < size * (size + 1)) dashSquares.push([i - size]);
        if (i >= size * (size + 1) && i % (size + 1) == 0) dashSquares.push([i - size * (size + 1) - (i - size * (size + 1)) / (size + 1)]);
        if (i >= size * (size + 1) && i % (size + 1) != 0 && (i + 1) % (size + 1) != 0) dashSquares.push([i - size * (size + 1) - 1 - Math.floor((i - size * (size + 1)) / (size + 1)), i - size * (size + 1) - Math.floor((i - size * (size + 1)) / (size + 1))]);
        if (i >= size * (size + 1) && (i + 1) % (size + 1) == 0) dashSquares.push([i - size * (size + 1) - 1 - (i - size * (size + 1) - size) / (size + 1)]);
    }

    return dashSquares;
}

const aiTurn = async () => {

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let timeLimit = 500;
    let startTime = Date.now();
    let dash = minimax(dashes, squares, startTime, timeLimit);
    let delay = timeLimit - (Date.now() - startTime);

    await sleep(delay);

    if (dash == null) return;

    let dashEl = getDashEl(dash);

    fillDash(dashEl);
    
    if (updateBoard(dash, dashes, squares, player)) {

        fillSquares(dash);

        if (gameOver(squares)) {
            setTimeout(endGame, 500); 
            return;
        }
        
        setTimeout(aiTurn, 1000);
        return;
    }

    if (gameOver(squares)) {
        setTimeout(endGame, 500); 
        return;
    } 

    togglePlayer();
    setTimeout(enableTouch, 250);
} 

const humanTurn = (e) => {

    let dashEl = e.currentTarget;

    if (fillDash(dashEl)) {

        let dash = getDash(dashEl);

        disableTouch();

        if (!updateBoard(dash, dashes, squares, player)) {

            if (gameOver(squares)) {
                setTimeout(endGame, 500); 
                return;
            } 

            togglePlayer();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(aiTurn, 500);
                });
            }); 
        
            return;
        }

        fillSquares(dash);

        if (gameOver(squares)) {
            setTimeout(endGame, 500); 
            return;
        } 

        enableTouch();
    }
}

const newGame = () => {

    initBoard();
    clearBoard();

    player = firstPlayer = firstPlayer == blue ? pink : blue;

    if (firstPlayer == localStorage.getItem('squares-color')) {
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

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

const init = () => {
    registerServiceWorker();
    disableTapZoom();
    initBoard();
    setColors();
}

window.onload = () => document.fonts.ready.then(init);
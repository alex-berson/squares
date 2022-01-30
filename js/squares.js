let board = [];
let size = 3;
let player = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const dashSquares = (selectedDash) => {

    let dashes = document.querySelectorAll('.dash');

    for (let [i, dash] of dashes.entries()) {
        if (dash == selectedDash) {

            if (i < size) return [[i, 0]];
            if (i >= size * size) return [[i - size, 2]];

            return [[i, 0], [i - size, 2]]; 
        }
    }

    dashes = document.querySelectorAll('.dash-v');

    for (let [i, dash] of dashes.entries()) {
        if (dash == selectedDash) {

            if (i % (size + 1) == 0) return [[i / (size + 1) * size, 3]];
            if (i % (size + 1) == size) return [[i - (i  + 1) / (size + 1), 1]];

            return [[Math.floor(i / (size + 1)) * size + i % (size + 1), 3], [Math.floor(i / (size + 1)) * size + i % (size + 1) - 1, 1]]; 
        }
    }
}

const dashNum = (selectedDash) => {

    let dashes = document.querySelectorAll('.dash, .dash-v');

    for (let [i, dash] of dashes.entries()) {
        if (dash == selectedDash) return i;
    }
}

const updateBoard = (dashes) => {

    dashes.forEach(dash => {
        board[dash[0]][dash[1]] = player;
    })

    console.log(board);

} 

const checkWin = () => {


    console.log("CHECK");

    let boxes = document.querySelectorAll('.box');

    outer: for (let [i, square] of board.entries()) {

        for (let i = 0; i < 4; i++) {
            if (square[i] == 0) continue outer;
        }

        console.log("SWITCH");

        console.log(squares[i]);

        switch (player) {
            case 1:
                boxes[i].classList.add("blue");
                break;
            case 2:
                boxes[i].classList.add("pink");
                break;
            default:
                break;
        }
    }
}

checkSquares = (squares) => {

    let boxes = document.querySelectorAll('.box');

    let occupied = false;

    outer: for (let square of squares) {

        for (let i = 0; i < 4; i++) {
            if (board[square[0]][i] == 0) continue outer;
        }

        occupied = true;

        switch (player) {
            case 1:
                boxes[square[0]].classList.add("blue");
                break;
            case 2:
                boxes[square[0]].classList.add("pink");
                break;
            default:
                break;
        }   
    }

    return occupied;

}

const select = (e) => {

    // console.log("SELECT");

    let dash = e.currentTarget;

    if (dash.classList.contains("blue") || dash.classList.contains("pink")) return;

    switch (player) {
        case 1:
            dash.classList.add("blue");
            break;
        case 2:
            dash.classList.add("pink");
            break;
        default:
            break;
    }

    console.log(dashSquares(dash));

    let squares = dashSquares(dash);

    updateBoard(squares);

    if (!checkSquares(squares)) player == 1 ? player = 2 : player = 1;
} 

const initBoard = () => {

    for (let i = 0; i < size * size; i++) {
        // for (let i = 0; i < size; i++) {
            board.push([0,0,0,0]);
        // }
    }

    console.log(board);
}

const disableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.removeEventListener('touchstart', select);
        } else {
            dash.removeEventListener('mousedown', select);
        }
    });
}

const enableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.addEventListener('touchstart', select);
        } else {
            dash.addEventListener('mousedown', select);
        }
    });
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const init = () => {

    disableTapZoom();
    initBoard();
    enableTouch();
}

window.onload = () => {
    document.fonts.ready.then(() => {
            init();     
    });
}
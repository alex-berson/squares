let board = [];
let size = 3;
let player = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const changeColor = () => player == 1 ? player = 2 : player = 1;

const shuffle = ([...array]) => {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

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

    console.log(board.map(arr => arr.slice()));
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

const occupySquares = (squares) => {

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

const getDash = (square, side) => {

    let dash = 0;
    let dashes = document.querySelectorAll('.dash');
    let dashesV = document.querySelectorAll('.dash-v');

    // console.log(dashes, dashesV);


    switch (side) {

        case 0:
            dash = dashes[square];
            break;
        case 1:
            dash = dashesV[square + Math.floor(square / size) + 1];
            break;
        case 2:
            dash = dashes[square + size];
            break;
        case 3:
            dash = dashesV[square + Math.floor(square / size)];
            break;
    }

    // console.log(dash);

    return dash;
}

const randomAI = () => {

    let squares = shuffle(Array.from({length: size * size}, (_, i) => i));
    let sides = shuffle([0, 1, 2, 3]);

    for (let square of squares) {
        for (let side of sides) {
            if (!board[square][side]) return [square, side];
        }
    }

    return [null, null];
}

const threeSides = (squares, sides) => {

    for (let square of squares) {

        let openedSide = 0;
        let numOpened = 0;

        for (let side of sides) {
            if (!board[square][side]) {
                openedSide = side;
                numOpened++
            }
        }

        if (numOpened == 1) return [square, openedSide];
    }

    return [null, null];
}

const ajacentSquareOpened = (square) => {

        let numOpened = 0;

        for (let i = 0; i < 4; i++) {
            if (!board[square][i]) {
                numOpened++
            }
        }

        return numOpened;
}

const oneSide = (squares, sides) => {

    for (let square of squares) {

        let openedSides = [];
        let numOpened = 0;

        for (let side of sides) {
            if (!board[square][side]) {
                openedSides.push(side);
                numOpened++
            }
        }

        if (numOpened < 3) continue;

        for (let side of openedSides) {

            switch (side) {

                case 0:
                    if (square < size) return [square, side];
                    if (square >= size && ajacentSquareOpened(square - size) >= 3) return [square, side];
                    break;
                case 1:
                    if ((square + 1) % size == 0) return [square, side];
                    if ((square + 1) % size && ajacentSquareOpened(square + 1) >= 3) return [square, side];
                    break;
                case 2:
                    if (square >= size * (size - 1)) return [square, side];
                    if (square < size * (size - 1) && ajacentSquareOpened(square + size) >= 3) return [square, side];
                    break;
                case 3:
                    if (square % size == 0) return [square, side];
                    if (square % size && ajacentSquareOpened(square - 1) >= 3) return [square, side];
                    break;
            }
        }
    }

    return [null, null];
}

const simpleAI = () => {

    let squares = shuffle(Array.from({length: size * size}, (_, i) => i));
    let sides = shuffle([0, 1, 2, 3]);

    let [square, side] = threeSides(squares, sides);

    if (square != null) return [square, side];
    
    [square, side] = oneSide(squares, sides);

    if (square != null) return [square, side];   
    
    [square, side] = randomAI();

    return [square, side];
}

const aiTurn = () => {

    let [square, side] = simpleAI();

    if (square == null) return;
    
    let dash = getDash(square, side);

    if (select(dash)) {
        setTimeout(aiTurn, 500);
        return;
    }

    changeColor();
    setTimeout(enableTouch, 500);
} 

const humanTurn = (e) => {

    let dash = e.currentTarget;

    disableTouch();

    if (!select(dash)) {

        changeColor();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 500);
            });
        }); 
        
        return;

    }

    enableTouch();
}

const select = (dash) => {

    dash = dash.currentTarget ? dash.currentTarget : dash;

    // let dash = e.currentTarget;

    if (dash.classList.contains("blue") || dash.classList.contains("pink")) return true;

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

    // console.log(dashSquares(dash));

    let squares = dashSquares(dash);

    updateBoard(squares);

    if (occupySquares(squares)) return true;

    return false;
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
            dash.removeEventListener('touchstart', humanTurn);
        } else {
            dash.removeEventListener('mousedown', humanTurn);
        }
    });
}

const enableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.addEventListener('touchstart', humanTurn);
        } else {
            dash.addEventListener('mousedown', humanTurn);
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
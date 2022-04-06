let blue = 1;
let pink = 2;
let size = 3;

const changeColor = () => player == blue ? player = pink : player = blue;

const win = (squares) => squares.blue + squares.pink == 9 ? true : false;

const winner = (squares) => squares.blue > squares.pink ? blue : pink;

const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

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

    let filled = false;

    dashes[dash] = color;

    for (let n of dashSquares[dash]) {

        squares[n]++;

        if (squares[n] == 4) {
            color == blue ? squares.blue++ : squares.pink++;
            filled = true;
        }
    }

    return filled;
}

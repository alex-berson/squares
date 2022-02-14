let dashes = [];
let squares = [];
let dashSquares = [];

let size = 3;
let depth = 1;

let blue = 1;
let pink = 2;

let player = blue;

let turnInterval;
let turn = 0;

let scores = [];

let bluesW = 0;
let pinksW = 0;

const touchScreen = () => matchMedia('(hover: none)').matches;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const changeColor = () => player == blue ? player = pink : player = blue;

const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

const shuffle = ([...array]) => {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}


const rePlay = () => {

    player = blue;
    let elements = document.querySelectorAll('.dash, .dash-v, .box');

    for (let element of elements) {

        element.classList.remove("blue");
        element.classList.remove("pink");
    }

    setTimeout(() => {turnInterval = setInterval(aiTurn, 1000)}, 1000);


}

const evaluation = (squares) => {

    if (player == blue) {

        // if (squares.blue > squares.pink) {

        //     if (squares.blue + squares.pink == squares.length) return 10 * (squares.blue - squares.pink);

        //     return squares.blue - squares.pink;
        // }

        if (squares.blue + squares.pink == squares.length) return 10 * (squares.blue - squares.pink);

        return squares.blue - squares.pink;
    }

    // if (squares.pink > squares.blue) {

    //     if (squares.blue + squares.pink == squares.length) return 10 * (squares.pink - squares.blue);

    //     return squares.pink - squares.blue;
    // }

    if (squares.blue + squares.pink == squares.length) return 10 * (squares.pink - squares.blue);

        return squares.pink - squares.blue;
}

const alphabeta = (dashes, squares, depth, alpha, beta, maximizingPlayer, startTime, timeLimit, first) => {

    // let newDashes, newSquares;
    let bestScore, isMax;
    let freeSeq = freeDashes(dashes);

    if (first) freeSeq = shuffle(freeDashes(dashes));

    let opponent = player == blue ? pink : blue;
    let bestDash = freeSeq[Math.floor(Math.random() * freeSeq.length)];

    if (depth == 0 || freeSeq.length == 0) return [null, evaluation(squares)];
    if (timeOver(startTime, timeLimit)) return [null, null];
    // if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];

    if (maximizingPlayer) {

        // if (first && timeOver(startTime, timeLimit)) return [null, null];
        
        bestScore = -Infinity;
        
        for (let dash of freeSeq) {

            let [newDashes, newSquares] = copyBoard(dashes, squares);

            if (updateBoard(dash, newDashes, newSquares, player)) {
                isMax = true;
            } else {
                isMax = false;
            }
    
            [_, score] = alphabeta(newDashes, newSquares, depth - 1, alpha, beta, isMax, startTime, timeLimit, false);

            if (score > bestScore) [bestScore, bestDash] = [score, dash];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }

        return [bestDash, bestScore];

    } else {

        // if (first && timeOver(startTime, timeLimit)) return [null, null];

        bestScore = Infinity;
        
        for (let dash of freeSeq) {

            let [newDashes, newSquares] = copyBoard(dashes, squares);
    
            if (updateBoard(dash, newDashes, newSquares, opponent)) {
                isMax = false;
            } else {
                isMax = true;
            }    

            [_, score] = alphabeta(newDashes, newSquares, depth - 1, alpha, beta, isMax, startTime, timeLimit, false);
    
            if (score < bestScore) [bestScore, bestDash] = [score, dash];

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }

        return [bestDash, bestScore];
    }
}

const minimax = (dashes, squares) => {

    let startTime = new Date();
    let timeLimit = 600;
    let dash, score, lastDash, lastScore;
    depth = 1;

    do {
        scores = [];

        [dash, score] = alphabeta(dashes, squares, depth, -Infinity, Infinity, true, startTime, timeLimit, true);

        if (score != null) [lastDash, lastScore] = [dash, score];

        depth++;

    } while (!timeOver(startTime, timeLimit) && depth <= freeDashes(dashes).length);

    console.log("depth", depth - 1);

    // alert(depth - 1);

    console.log(lastDash, lastScore);


    // depth -= 2;

    return [lastDash, lastScore];
}

const copyBoard = (dashes, squares) => {

    let newDashes = dashes.slice();
    let newSquares = squares.slice();

    // let newDashes = [...dashes];
    // let newSquares = [...squares];
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

const mcs = (dashes, squares, startTime, timeLimit) => {

    let i = 0;

    let stats = [];

    for (let i = 0; i < dashes.length; i++) {
        stats.push([0,0]);
    }

    // console.log(stats);
    // console.log(dashes);


    let freeSeq = freeDashes(dashes);

    console.log(freeSeq);

    do {

        let color = player;
        
        let firstMove = null;
        let [newDashes, newSquares] = copyBoard(dashes, squares);

        // console.log(newDashes);
        // console.log(newSquares);

        let seq = shuffle(freeSeq);

        // console.log(seq);

        i++;

        for (let i = 0; i < freeSeq.length; i++) {

            // console.log(i);
            // console.log(newDashes);
            // console.log(newSquares);

            let dash = seq.pop();

            if (firstMove == null) firstMove = dash;   
            
            if (updateBoard(dash, newDashes, newSquares, color)) continue;

            color = color == blue ? pink : blue;
        }

        // console.log(firstMove);


        if (firstMove == null) return null;

        stats[firstMove][1]++;

        if (newSquares.blue > newSquares.pink) {
            player == blue ? stats[firstMove][0]++ : stats[firstMove][0]--;
        } else {
            player == blue ? stats[firstMove][0]-- : stats[firstMove][0]++;
        }

    } while (!timeOver(startTime, timeLimit));

    console.log(i, player);

    console.log("STATS: ", stats);

    let bestValue = -Infinity;
    let bestMove = null;

    for (let i = 0; i < dashes.length; i++) {
        
            if (stats[i][1] == 0) continue;

            if (stats[i][0] / stats[i][1] > bestValue) {
                bestValue = stats[i][0] / stats[i][1];
                bestMove = i;
            }
    }

    console.log(bestMove);

    return bestMove;
}

const threeSides = (dashes, squares, seq) => {

    for (let i = 0; i < dashes.length; i++) {

        let dash = seq[i];

        if (dashes[dash] != 0) continue;

        for (let square of dashSquares[dash]) {

            if (squares[square] == 3) return dash;

        }
    }

    return null;
}

const oneSides = (dashes, squares, seq) => {

    outer: for (let i = 0; i < dashes.length; i++) {

        let dash = seq[i];

        if (dashes[dash] != 0) continue;

        for (let square of dashSquares[dash]) {

            if (squares[square] == 2) continue outer;

        }

        return dash;
    }

    return null;
}

const simpleAI = (dashes, squares) => {

    // console.log(dashes);
    // console.log(squares);

    let seq = shuffle(Array.from({length: dashes.length}, (_, i) => i));

    let dash = threeSides(dashes, squares, seq);

    if (dash != null) return dash;
    
    dash = oneSides(dashes, squares, seq);

    if (dash != null) return dash;   
    
    dash = randomAI(dashes);

    return dash;
}

const randomAI = (dashes) => {

    let seq = shuffle(Array.from({length: dashes.length}, (_, i) => i));

    for (let i = 0; i < dashes.length; i++){

        if (dashes[seq[i]] == 0) return seq[i];
    }

    return null;
}

const getDashEl = (dash) => {

    let dashesEl = document.querySelectorAll('.dash');
    let dashesVEl = document.querySelectorAll('.dash-v');

    return dash < dashesEl.length ?  dashesEl[dash] :  dashesVEl[dash - dashesEl.length];   
}

const win = (squares) => {

    if (squares.blue + squares.pink == 9) return true;

    return false;
}

const aiTurn = () => {

    let dash

    depth = 1;

    // let dash = randomAI(dashes);

    // let dash = simpleAI(dashes, squares);

    // if (player == blue) {
        
        // dash = mcs(dashes, squares, startTime, timeLimit);

    // } else {

        [dash, _] = minimax(dashes, squares);


    // }



    // console.log(dash, score);

    if (dash == null) return;

    let dashEl = getDashEl(dash);

    if (select(dashEl)) {

        // if (win(squares)) {
        //     squares.blue - squares.pink > 0 ? bluesW++ : pinksW++; //
        //     console.log(turn++, bluesW, pinksW);
        //     clearInterval(turnInterval);
        //     initBoard();
        //     setTimeout(rePlay, 2000);
        // }

        setTimeout(aiTurn, 1000); //
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

    disableTouch();

    if (!select(dashEl)) {

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

const getDash = (dashEl) => {

    let dashesEl = document.querySelectorAll('.dash');

    for (let i = 0; i < dashesEl.length; i ++) {
        if (dashesEl[i] == dashEl) return i;
    }

    dashesEl = document.querySelectorAll('.dash-v');

    for (let i = 0; i < dashesEl.length; i ++) {
        if (dashesEl[i] == dashEl) return i + dashesEl.length;
    }
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

const fillSquares = (dash) => {

    let boxes = document.querySelectorAll('.box');

    for (let square of dashSquares[dash]) {

        if (squares[square] < 4) continue;

        player == blue ? boxes[square].classList.add("blue") : boxes[square].classList.add("pink");
    }
}

const select = (dashEl) => {

    dashEl = dashEl.currentTarget ? dashEl.currentTarget : dashEl;

    // let dash = e.currentTarget;

    if (dashEl.classList.contains("blue") || dashEl.classList.contains("pink")) return true;

    player == blue ? dashEl.classList.add("blue"): dashEl.classList.add("pink");
    
    let dash = getDash(dashEl);

    if (updateBoard(dash, dashes, squares, player)) {

        fillSquares(dash);
        
        return true;
    };

    return false;
} 

const findSquares = () => {

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

    dashSquares = findSquares();

    console.log(dashSquares);
    console.log(findSquares());

    // dashes[8] = 0;
    // dashes[11] = 0;
    // squares[5] = 3;
    // squares[8] = 2;
}

const disableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.removeEventListener('touchstart', humanTurn);
            // dash.removeEventListener('touchmove', humanTurn);
        } else {
            dash.removeEventListener('mousedown', humanTurn);
        }
    });
}

const enableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.addEventListener('touchstart', humanTurn);
            // dash.addEventListener('touchmove', humanTurn);
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
const evaluation = (squares) => {

    let diff = player == blue ? squares.blue - squares.pink : squares.pink - squares.blue;

    return squares.blue + squares.pink == squares.length ? 100 * diff : diff;
}

const alphabeta = (dashes, squares, depth, alpha, beta, maximizingPlayer, startTime, timeLimit, firstLevel) => {

    let bestScore;
    let freeSeq = firstLevel ? shuffle(freeDashes(dashes)) : freeDashes(dashes);
    let opponent = player == blue ? pink : blue;
    let bestDash = freeSeq[Math.floor(Math.random() * freeSeq.length)];

    if (depth == 0 || freeSeq.length == 0) return [null, evaluation(squares)];
    if (timeOver(startTime, timeLimit)) return [null, null];

    if (maximizingPlayer) {
        
        bestScore = -Infinity;
        
        for (let dash of freeSeq) {

            let [newDashes, newSquares] = copyBoard(dashes, squares);
            let maximizingPlayer = updateBoard(dash, newDashes, newSquares, player);
    
            [_, score] = alphabeta(newDashes, newSquares, depth - 1, alpha, beta, maximizingPlayer, startTime, timeLimit, false);

            if (score > bestScore) [bestScore, bestDash] = [score, dash];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }

        return [bestDash, bestScore];

    } else {

        bestScore = Infinity;
        
        for (let dash of freeSeq) {

            let [newDashes, newSquares] = copyBoard(dashes, squares);
            let maximizingPlayer = !updateBoard(dash, newDashes, newSquares, opponent);

            [_, score] = alphabeta(newDashes, newSquares, depth - 1, alpha, beta, maximizingPlayer, startTime, timeLimit, false);
    
            if (score < bestScore) [bestScore, bestDash] = [score, dash];

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }

        return [bestDash, bestScore];
    }
}

const minimax = (dashes, squares, timeLimit) => {

    let startTime = new Date();
    let dash, bestDash;
    let depth = 1;

    do {
        
        [dash, _] = alphabeta(dashes, squares, depth, -Infinity, Infinity, true, startTime, timeLimit, true);

        if (timeOver(startTime, timeLimit)) break;

        bestDash = dash;
        depth++;

    } while (depth <= freeDashes(dashes).length);

    do {} while (!timeOver(startTime, timeLimit));

    return bestDash;
}

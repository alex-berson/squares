const evaluation = (squares) => {

    if (player == blue) {

        if (squares.blue + squares.pink == squares.length) return 10 * (squares.blue - squares.pink);
        
        return squares.blue - squares.pink;
    }

    if (squares.blue + squares.pink == squares.length) return 10 * (squares.pink - squares.blue);

    return squares.pink - squares.blue;
}

const alphabeta = (dashes, squares, depth, alpha, beta, maximizingPlayer, startTime, timeLimit, firstLevel) => {

    // let newDashes, newSquares;
    let bestScore, isMax;
    let freeSeq = freeDashes(dashes);

    if (firstLevel) freeSeq = shuffle(freeDashes(dashes));

    let opponent = player == blue ? pink : blue;
    let bestDash = freeSeq[Math.floor(Math.random() * freeSeq.length)];

    if (depth == 0 || freeSeq.length == 0) return [null, evaluation(squares)];
    
    if (timeOver(startTime, timeLimit)) {cut = true;  return [null, null]};
    // if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];

    if (maximizingPlayer) {

        // if (first && timeOver(startTime, timeLimit)) return [null, null];
        
        bestScore = -Infinity;
        
        for (let dash of freeSeq) {

            let [newDashes, newSquares] = copyBoard(dashes, squares);
           
            let maximizingPlayer = updateBoard(dash, newDashes, newSquares, player);

            // if (updateBoard(dash, newDashes, newSquares, player)) {
            //     isMax = true;
            // } else {
            //     isMax = false;
            // }

            // if (maximizer != isMax) console.log("!=");
    
            [_, score] = alphabeta(newDashes, newSquares, depth - 1, alpha, beta, maximizingPlayer, startTime, timeLimit, false);

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

            let maximizingPlayer = !updateBoard(dash, newDashes, newSquares, opponent);
    
            // if (updateBoard(dash, newDashes, newSquares, opponent)) {
            //     isMax = false;
            // } else {
            //     isMax = true;
            // }    

            // if (maximizer != isMax) console.log("!=");

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
    // let timeLimit = 500;
    let dash, score, lastDash, lastScore;
    let depth = 1;

    do {
        // scores = [];

        [dash, score] = alphabeta(dashes, squares, depth, -Infinity, Infinity, true, startTime, timeLimit, true);

        // console.log(score);

        if (timeOver(startTime, timeLimit)) break;

        [lastDash, lastScore] = [dash, score];

        depth++;

    } while (depth <= freeDashes(dashes).length);

    do {} while (!timeOver(startTime, timeLimit));


    // await new Promise(r => setTimeout(r, timeLimit - (new Date() - startTime)));

    // console.log("depth: ", depth - 1, "time:", timeLimit);

    // alert(depth - 1);

    // console.log(lastDash, lastScore);


    // depth -= 2;

    return [lastDash, depth - 1];
}

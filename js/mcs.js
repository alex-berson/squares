const freeDashes = (dashes) => {

    let seq = [];

    for (let i = 0; i < dashes.length; i++) {

        if (dashes[i] == 0) seq.push(i);
    }

    return seq;
}

const mcs = (dashes, squares) => {

    let startTime = new Date();
    let timeLimit = 500;

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
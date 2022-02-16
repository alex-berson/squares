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
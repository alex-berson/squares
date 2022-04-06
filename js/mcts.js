// let nodes; //

const createNode = (node, color, move) => {

    let [newDashes, newSquares] = copyBoard(node.dashes, node.squares);

    let occupied  = updateBoard(move, newDashes, newSquares, color)

    node.children.push({});
    
    let n = node.children.length - 1;

    node.children[n].dashes = newDashes;
    node.children[n].squares = newSquares;
    node.children[n].occupied = occupied;
    node.children[n].move = move;
    node.children[n].parent = node;
    node.children[n].color = color;
    node.children[n].plays = Number.MIN_VALUE;
    node.children[n].wins = 0;
    node.children[n].children = [];
} 

const createRoot = (dashes, squares, color) => {

    let revercedColor = color == blue ? pink : blue;

    let root = {};

    [root.dashes, root.squares] = copyBoard(dashes, squares);
    root.parent = null;
    root.color = revercedColor;
    root.plays = Number.MIN_VALUE;
    root.wins = 0;
    root.children = [];

    let moves = shuffle(freeDashes(dashes));

    for (let move of moves) {

        createNode(root, color, move);

    }

    return root;
}

const selection = (tree) => {

    let node = tree;

    while (node.children.length) {

            let maxChild;
            let maxUCB1 = -Infinity;
    
            for (let child of node.children) {
    
                let ucb1 = child.wins / child.plays + 1.5 * Math.sqrt(Math.abs(Math.log(child.parent.plays)) / child.plays);
    
                if (ucb1 > maxUCB1) [maxChild, maxUCB1] = [child, ucb1];
            } 

            node = maxChild;
    }

    return node;
}

const expansion = (node) => {

    let revercedColor = node.color == blue ? pink : blue;

    let color = node.occupied ? node.color : revercedColor;

    let moves = shuffle(freeDashes(node.dashes));

    if (moves.length == 0) return node;

    for (let move of moves) {

        createNode(node, color, move);
    }

    return node.children[0];
}

const simulation = (node) => {

    let revercedColor = node.color == blue ? pink : blue;
    let color = node.occupied ? node.color : revercedColor;
    let [newDashes, newSquares] = copyBoard(node.dashes, node.squares);
    let freeSeq = shuffle(freeDashes(newDashes));

    for (let i = 0; i < freeSeq.length; i++) {

        let move = freeSeq.pop();
        
        if (updateBoard(move, newDashes, newSquares, color)) continue;

        color = color == blue ? pink : blue;               
    }

    return winner(newSquares);
}

const backprapogation = (node, color) => {

    do {
        node.plays++;
        if (node.color == color) node.wins++;
        node = node.parent;
    } while (node != null)
} 

const mcts = (dashes, squares) => {

    let startTime = new Date();
    let timeLimit = 1000;

    let color = player;

    // nodes = 0;  //

    if (freeDashes(dashes).length == 0) return null;

    let tree = createRoot(dashes, squares, color);

    let i = 0;

    do {

        i++;

        let node = selection(tree);

        if (node.plays != Number.MIN_VALUE) node = expansion(node);

        let winCol = simulation(node);

        backprapogation(node, winCol);

    } while (!timeOver(startTime, timeLimit));

    // console.log(i, color);

    let bestMove;
    let bestValue = -Infinity;

    for (child of tree.children) {

        let value = child.wins / child.plays;

        // console.log(child.move, value);

        if (value > bestValue) [bestValue, bestMove] = [value, child.move];
    }

    return [bestMove, i];
}
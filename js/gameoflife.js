function seed() {
    return [...arguments];
}

function same([x, y], [j, k]) {
    return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
    return this.some((item) => same(item, cell));
}

const printCell = (cell, state) => {
    return contains.call(state, cell) ? "\u25A3" : "\u25A2";
};

const corners = (state = []) => {
    let topRight = [0, 0],
        bottomLeft = [0, 0];

    if (state.length !== 0) {
        const axis = state.reduce(
            (prev, [x, y]) => ({
                x: [...prev.x, x],
                y: [...prev.y, y],
            }),
            { x: [], y: [] }
        );

        const { [0]: minX, [state.length - 1]: maxX } = axis.x.sort();
        const { [0]: minY, [state.length - 1]: maxY } = axis.y.sort();

        topRight = [maxX, maxY];
        bottomLeft = [minX, minY];
    }

    return { topRight, bottomLeft };
};

const printCells = (state) => {
    const { topRight, bottomLeft } = corners(state);
    let output = "";
    for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
        for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
            output += printCell([x, y], state);
            if (x < topRight[1]) output += " ";
        }
        output += "\n";
    }
    return output;
};

const getNeighborsOf = ([x, y]) =>
    [...new Array(3)]
        .map((_, i) => [...new Array(3)].map((_, j) => [x - 1 + i, y - 1 + j]))
        .flat(1)
        .filter((cell) => !same(cell, [x, y]));

const getLivingNeighbors = (cell, state) =>
    getNeighborsOf(cell).filter(contains.bind(state));

const willBeAlive = (cell, state) => {
    const { length } = getLivingNeighbors(cell, state);
    return length === 3 || (length === 2 && contains.call(state, cell));
};

const calculateNext = (state) => {
    const { topRight, bottomLeft } = corners(state);
    const next = [];
    for (let y = bottomLeft[1] - 1; y <= topRight[1] + 1; y++)
        for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++)
            if (willBeAlive([x, y], state)) next.push([x, y]);

    return next;
};

const iterate = (state, iterations) => {
    const states = [state];
    for (let i of Array(iterations))
        states.push(calculateNext(states[states.length - 1]));
    return states;
};

const main = (pattern, iterations) =>
    iterate(startPatterns[pattern], iterations).forEach((item) =>
        console.log(printCells(item))
    );

const startPatterns = {
    rpentomino: [
        [3, 2],
        [2, 3],
        [3, 3],
        [3, 4],
        [4, 4],
    ],
    glider: [
        [-2, -2],
        [-1, -2],
        [-2, -1],
        [-1, -1],
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [2, 3],
    ],
    square: [
        [1, 1],
        [2, 1],
        [1, 2],
        [2, 2],
    ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
        main(pattern, parseInt(iterations));
    } else {
        console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;

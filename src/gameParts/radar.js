

class Radar {

    #board = null;

    constructor() {
        this.#board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.hitSymbol = 1;
        this.missSymbol = -1;
    };


    get board() {
        return this.#board;
    };


    recordAttack(row, col, hit=false) {
        const rowValid = 0 <= row && row < this.#board.length;
        const colValid = 0 <= col && col < this.#board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }

        const symbol = (hit) ? this.hitSymbol : this.missSymbol;
        this.#board[row][col] = symbol;
        return true;
    };
};


export default Radar;
import Ship from "./ship.js";


class Board {

    #board = null;
    #ships = null;
    #maxShipCapacity = null;

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
        this.#ships = [];
        this.#maxShipCapacity = 5;
    };


    get board() {
        return this.#board.slice();
    };


    #isValidPlacement(length, row, col, horizontal) {
        const rowValid = 0 <= row && row < this.#board.length;
        const colValid = 0 <= col && col < this.#board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }

        let finalRow = row;
        let finalCol = col;
        if (horizontal) {
            finalCol += (length - 1);
        } else {
            finalRow += (length - 1);
        }

        const finalRowValid = 0 <= finalRow && finalRow < this.#board.length;
        const finalColValid = 0 <= finalCol && finalCol < this.#board[0].length;
        if (!finalRowValid || !finalColValid) {
            return false;
        }
        return true;
    };


    placeShip(length, row, col, horizontal) {
        if (this.#ships.length === this.#maxShipCapacity) {
            return false;
        }
        if (!this.#isValidPlacement(length, row, col, horizontal)) {
            return false;
        }

        const ship = new Ship(length);

        for (let i = 0; i < length; i += 1) {
            const rowValid = 0 <= row && row < this.#board.length;
            const colValid = 0 <= col && col < this.#board[0].length;
            if (!rowValid || !colValid) {
                return false;
            }

            this.#board[row][col] = ship;
            if (horizontal) {
                col += 1;
            } else {
                row += 1;
            }
        }

        this.#ships.push(ship);
        return true;
    }; 
};


export default Board;
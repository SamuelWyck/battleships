import Ship from "./ship.js";


class Board {

    #board = null;
    #ships = null;
    #maxShipCapacity = null;
    #attackedPositions = null;
    #missSymbol = null;
    #emptySymbol = null;

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
        this.#attackedPositions = new Set();
        this.#missSymbol = -1;
        this.#emptySymbol = 0;
    };


    get board() {
        return this.#board;
    };


    get ships() {
        return this.#ships;
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
        return this.#isClearSpace(length, row, col, horizontal);
    };


    #isClearSpace(length, row, col, horizontal) {
        for (let i = 0; i < length; i += 1) {
            const pos = this.#board[row][col];
            if (typeof pos !== "number") {
                return false;
            }

            if (horizontal) {
                col += 1;
            } else {
                row += 1;
            }
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


    receiveAttack(row, col) {
        const rowValid = 0 <= row && row < this.#board.length;
        const colValid = 0 <= col && col < this.#board[0].length;
        if (!rowValid || !colValid) {
            return [null, null, null];
        }
        const key = JSON.stringify([row, col]);
        if (this.#attackedPositions.has(key)) {
            return [null, null, null];
        }

        this.#attackedPositions.add(key);
        const position = this.#board[row][col];
        if (typeof position === "number") {
            this.#board[row][col] = this.#missSymbol;
            return [false, false, null];
        }

        const ship = position;
        ship.hit();
        return [true, ship.isSunk(), ship];
    };


    allShipsSunk() {
        if (this.#ships.length === 0) {
            return false;
        }
        for (let ship of this.#ships) {
            if (!ship.isSunk()) {
                return false;
            }
        }
        return true;
    };


    clearBoard() {
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
        this.#attackedPositions = new Set();
    };


    removeShip(row, col) {
        const rowValid = 0 <= row && row < this.#board.length;
        const colValid = 0 <= col && col < this.#board[0].length;
        if (!rowValid || !colValid) {
            return;
        }
        const ship = this.#board[row][col];
        this.#removeShipFromList(ship);
        this.#removeShipRecursive(ship, row, col, new Set());
        return ship;
    };


    #removeShipFromList(ship) {
        const newArray = [];
        for (let oldShip of this.#ships) {
            if (oldShip !== ship) {
                newArray.push(oldShip);
            }
        }
        this.#ships = newArray;
    };


    #removeShipRecursive(ship, row, col, visited) {
        const rowValid = 0 <= row && row < this.#board.length;
        const colValid = 0 <= col && col < this.#board[0].length;
        if (!rowValid || !colValid) {
            return;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return;
        }
        if (this.#board[row][col] === this.#emptySymbol) {
            return;
        }
        if (this.#board[row][col] !== ship) {
            return;
        }

        visited.add(key);
        this.#board[row][col] = this.#emptySymbol;

        const neigbors = [
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1],
        ];

        for (let neighbor of neigbors) {
            const nr = neighbor[0];
            const nc = neighbor[1];
            this.#removeShipRecursive(ship, nr, nc, visited);
        }
    };
};


export default Board;
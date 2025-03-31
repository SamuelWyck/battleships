import Board from "./board.js";
import Radar from "./radar.js";


class Computer {

    constructor() {
        this.board = new Board();
        this.radar = new Radar();
        this.shipList = [2, 3, 3, 4, 5];
        this.filledPOsitions = new Set();
        this.shipSighted = false;
        this.prevHits = [];
    };


    placeShips() {
        while (this.shipList.length > 0) {
            const ship = this.shipList.pop();
            this.#placeShip(ship);
        }
    };


    #placeShip(ship) {
        while (true) {
            const horizontal = this.#randInt(1, 10) <= 5;
            const finalRow = (horizontal) ? this.board.board.length - 1 : this.board.board.length - ship;
            const finalCol = (horizontal) ? this.board.board[0].length - ship : this.board.board[0].length - 1;
            const row = this.#randInt(0, finalRow);
            const col = this.#randInt(0, finalCol);
            if (this.board.placeShip(ship, row, col, horizontal)) {
                break;
            }
        }
    };


    #randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    recordAttack(row, col, hit, sunk) {
        this.radar.recordAttack(row, col, hit);
        if (hit && !sunk) {
            this.shipSighted = true;
            this.prevHits.push({"row": row, "col": col});

        } else if (hit && sunk) {
            this.shipSighted = false;
            this.prevHits = [];
        }
    };


    makeAttack() {
        if (this.shipSighted) {
            return this.#getNextHit();
        } else {
            while (true) {
                const quadBounds = this.#getQuadrant();
                const coords = this.#getCoords(quadBounds);
                if (coords !== null) {
                    return coords;
                }
            }
        }
    };


    #getNextHit() {
        let minRow = Infinity;
        let maxRow = -Infinity;
        let minCol = Infinity;
        let maxCol = -Infinity;
        for (let prevHit of this.prevHits) {
            minRow = Math.min(prevHit.row, minRow);
            maxRow = Math.max(prevHit.row, maxRow);
            minCol = Math.min(prevHit.col, minCol);
            maxCol = Math.max(prevHit.col, maxCol);
        }

        if (minCol === maxCol) {
            //make this part a helper method
            const row = minRow - 1;
            const col = minCol;

            const rowValid = 0 <= row && row < this.radar.board.length;
            const colValid = 0 <= col && col < this.radar.board[0].length;
            if (!rowValid || !colValid || this.radar.board[row][col] === this.radar.missSymbol) {
                const otherRow = maxRow + 1;
                const otherCol = minCol;
                if (this.radar.board[otherRow][otherCol] !== this.radar.missSymbol) {
                    return [otherRow, otherCol];
                }
            } else {
                return [row, col];
            }
        } 
        
        const row = minRow;
        const col = minCol - 1;

        const rowValid = 0 <= row && row < this.radar.board.length;
        const colValid = 0 <= col && col < this.radar.board[0].length;
        if (!rowValid || !colValid || this.radar.board[row][col] === this.radar.missSymbol) {
            return [minRow, maxCol + 1];
        }

        return [row, col];
        //need to refactor and fix this method
    };


    #getCoords(quad) {
        const row = this.#randInt(quad.sRow, quad.eRow);
        const col = this.#randInt(quad.sCol, quad.eCol);
        if (this.radar.board[row][col] === this.radar.emptySymbol) {
            return {"row": row, "col": col};
        }
        return null;
    };


    #getQuadrant() {
        const finalRow = this.board.board.length - 1;
        const finalCol = this.board.board[0].length - 1;
        const quadNum = this.#randInt(0, 3);
        let quadrant = null;

        if (quadNum === 0) {
            quadrant = {
                "sRow": 0, "eRow": Math.floor(finalRow/2),
                "sCol": 0, "eCol": Math.floor(finalCol/2)
            };
        } else if (quadNum === 1) {
            quadrant = {
                "sRow": 0, "eRow": Math.floor(finalRow/2),
                "sCol": Math.floor(finalCol/2) + 1, "eCol": finalCol
            };
        } else if (quadNum === 2) {
            quadrant = {
                "sRow": Math.floor(finalRow/2) + 1, "eRow": finalRow,
                "sCol": Math.floor(finalCol/2) + 1, "eCol": finalCol 
            };
        } else {
            quadrant = {
                "sRow": Math.floor(finalRow/2) + 1, "eRow": finalRow,
                "sCol": 0, "eCol": Math.floor(finalCol/2)
            };
        }
        return quadrant;
    };
};



export default Computer;
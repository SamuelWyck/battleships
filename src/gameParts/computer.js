import Board from "./board.js";
import Radar from "./radar.js";
import ProbabilityBoard from "./probabilityBoard.js";


class Computer {

    constructor() {
        this.board = new Board();
        this.radar = new Radar();
        this.shipLengthsToFind = [2, 3, 3, 4, 5];
        this.heatMap = new ProbabilityBoard();
        this.heatMap.calculateProbability(this.shipLengthsToFind);
        this.shipList = [2, 3, 3, 4, 5];
        this.prevHits = [];
    };


    reset() {
        this.board.clearBoard();
        this.radar.clearBoard();
        this.heatMap.clearBoard();
        this.shipList = [2, 3, 3, 4, 5];
        this.prevHits = [];
        this.shipLengthsToFind = [2, 3, 3, 4, 5];
        this.heatMap.calculateProbability(this.shipLengthsToFind);
        console.log(this.heatMap.board)
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
        this.heatMap.recordAttack(row, col, hit);
        this.heatMap.resetProbability();
        if (hit && !sunk) {
            this.prevHits.push({"row": row, "col": col});
            this.heatMap.calculateTargetProbability(this.prevHits, this.shipLengthsToFind);
        } else if (hit && sunk) {
            this.#cleanPrevHits({"row": row, "col": col});
            this.prevHits = [];
            this.heatMap.calculateProbability(this.shipLengthsToFind);
        } else if (!hit && this.prevHits.length > 0) {
            this.heatMap.calculateTargetProbability(this.prevHits, this.shipLengthsToFind);
        } else {
            this.heatMap.calculateProbability(this.shipLengthsToFind);
        }
    };


    #cleanPrevHits(sinkingHit) {
        if (this.prevHits.length + 1 > 5) {
            const otherShip = this.#findOtherShip(this.prevHits.slice(), sinkingHit);
        }

        const beforeLength = this.shipLengthsToFind.length;
        this.#removeShipLength(this.prevHits.length);
        if (beforeLength === this.shipLengthsToFind.length) {

        }
    };


    #findOtherShip(prevHits, sinkingHit) {
        //figure out how to get from teh sinking hit to the hit farthest away from it
    };


    #removeShipLength(shipLength) {
        const newArray = [];
        let found = false;
        for (let length of this.shipLengthsToFind) {
            if (length === shipLength && !found) {
                found = true;
                continue;
            }
            newArray.push(length);
        }
        this.shipLengthsToFind = newArray;
        return found;
    };


    makeAttack() {
        // if (this.shipLengthsToFind.length === 0) {
        //     return;
        // }
        // if (this.sightedShips.length > 0) {
        //     return this.#getNextHit(this.sightedShips[0]);
        // } else {
        //     const attackList = this.heatMap.getBestAttacksList();
        //     const randomIdx = this.#randInt(0, attackList.length - 1);
        //     return attackList[randomIdx];
        // }
        const attackList = this.heatMap.getBestAttacksList();
        const randomIdx = this.#randInt(0, attackList.length - 1);
        return attackList[randomIdx];
    };


    #getNextHit(ship) {
        let minRow = Infinity;
        let maxRow = -Infinity;
        let minCol = Infinity;
        let maxCol = -Infinity;
        for (let prevHit of this.prevHits) {
            if (prevHit.ship === ship) {
                minRow = Math.min(prevHit.row, minRow);
                maxRow = Math.max(prevHit.row, maxRow);
                minCol = Math.min(prevHit.col, minCol);
                maxCol = Math.max(prevHit.col, maxCol);
            }
        }

        const orderChoice = this.#randInt(0, 1);

        if (orderChoice === 0) {
            if (minCol === maxCol) {
                const coord = this.#getVerticalHit(minRow, maxRow, minCol);
                if (coord !== null) {
                    return coord;
                }
            } 
            return this.#getHorizontalHit(minRow, minCol, maxCol);

        } else {
            if (minRow === maxRow) {
                const coord = this.#getHorizontalHit(minRow, minCol, maxCol);
                if (coord !== null) {
                    return coord;
                }
            }
            return this.#getVerticalHit(minRow, maxRow, minCol);
        }
    };


    #getVerticalHit(minRow, maxRow, minCol) {
        const row = minRow - 1;
        const col = minCol;

        const rowValid = 0 <= row && row < this.radar.board.length;
        const colValid = 0 <= col && col < this.radar.board[0].length;
        if (!rowValid || !colValid || this.radar.board[row][col] !== this.radar.emptySymbol) {
            const otherRow = maxRow + 1;

            const otherRowValid = 0 <= otherRow && otherRow < this.radar.board.length;
            if (otherRowValid && this.radar.board[otherRow][col] === this.radar.emptySymbol) {
                return {"row": otherRow, "col": col};
            } else {
                return null;
            }
        }

        return {"row": row, "col": col};
    };


    #getHorizontalHit(minRow, minCol, maxCol) {
        const row = minRow;
        const col = minCol - 1;

        const rowValid = 0 <= row && row < this.radar.board.length;
        const colValid = 0 <= col && col < this.radar.board[0].length;
        if (!rowValid || !colValid || this.radar.board[row][col] !== this.radar.emptySymbol) {
            const otherCol = maxCol + 1;

            const otherColValid = 0 <= otherCol && otherCol < this.radar.board[0].length;
            if (otherColValid && this.radar.board[row][otherCol] === this.radar.emptySymbol) {
                return {"row": row, "col": otherCol};
            } else {
                return null;
            }
        }

        return {"row": row, "col": col};
    };


    #enoughSpace(row, col) {
        let minLength = Infinity;
        for (let length of this.shipLengthsToFind) {
            minLength = Math.min(minLength, length);
        }

        const verticalChange = [
            {"rowChange": -1, "colChange": 0},
            {"rowChange": 1, "colChange": 0},
        ];
        const horizontalChange = [
            {"rowChange": 0, "colChange": -1},
            {"rowChange": 0, "colChange": 1},
        ];
        const positionChanges = [verticalChange, horizontalChange];

        for (let positionChange of positionChanges) {
            if (this.#spaceFree(row, col, minLength, 1, positionChange, new Set())) {
                return true;
            }
        }
        return false;
    };


    #spaceFree(row, col, targetlength, currentLength, posChange, visited) {
        const rowValid = 0 <= row && row < this.radar.board.length;
        const colValid = 0 <= col && col < this.radar.board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return false;
        }
        if (this.radar.board[row][col] !== this.radar.emptySymbol) {
            return false;
        }
        if (currentLength === targetlength) {
            return true;
        }

        visited.add(key);

        const firstChange = posChange[0];
        const secondChange = posChange[1];

        const firstResult = this.#spaceFree(
            row + firstChange.rowChange, col + firstChange.colChange, 
            targetlength, currentLength + 1, posChange, visited
        );
        if (firstResult) {
            return true;
        }

        return this.#spaceFree(
            row + secondChange.rowChange, col + secondChange.colChange,
            targetlength, currentLength + 1, posChange, visited
        );
    };
};



export default Computer;
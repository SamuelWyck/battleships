import Board from "./board.js";
import Radar from "./radar.js";


class Computer {

    constructor() {
        this.board = new Board();
        this.radar = new Radar();
        this.shipList = [2, 3, 3, 4, 5];
        this.sightedShips = [];
        this.prevHits = [];
        this.shipLengthsToFind = [2, 3, 3, 4, 5];
    };


    reset() {
        this.board.clearBoard();
        this.radar.clearBoard();
        this.shipList = [2, 3, 3, 4, 5];
        this.sightedShips = [];
        this.prevHits = [];
        this.shipLengthsToFind = [2, 3, 3, 4, 5];
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


    recordAttack(row, col, hit, sunk, ship) {
        this.radar.recordAttack(row, col, hit);
        if (hit && !sunk) {
            if (this.sightedShips.indexOf(ship) === -1) {
                this.sightedShips.push(ship);
            }
            this.prevHits.push({"row": row, "col": col, "ship": ship});

        } else if (hit && sunk) {
            this.#removeSightedShip(ship);
            this.#removeShipPrevHits(ship);
            this.#removeShipLength(ship.length);
        }
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
    };


    #removeSightedShip(ship) {
        const newArray = [];
        for (let sightedShip of this.sightedShips) {
            if (sightedShip !== ship) {
                newArray.push(sightedShip);
            }
        }
        this.sightedShips = newArray;
    };


    #removeShipPrevHits(ship) {
        const newArray = [];
        for (let prevHit of this.prevHits) {
            if (prevHit.ship !== ship) {
                newArray.push(prevHit);
            }
        }
        this.prevHits = newArray;
    };


    makeAttack() {
        if (this.shipLengthsToFind.length === 0) {
            return;
        }
        if (this.sightedShips.length > 0) {
            return this.#getNextHit(this.sightedShips[0]);
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


    #getCoords(quad) {
        const row = this.#randInt(quad.sRow, quad.eRow);
        const col = this.#randInt(quad.sCol, quad.eCol);
        if (this.radar.board[row][col] === this.radar.emptySymbol && this.#enoughSpace(row, col)) {
            return {"row": row, "col": col};
        }
        return null;
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
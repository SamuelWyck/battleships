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


    recordAttack(row, col, hit, sunk, length) {
        this.radar.recordAttack(row, col, hit);
        this.heatMap.recordAttack(row, col, hit);
        this.heatMap.resetProbability();
        if (hit && !sunk) {
            this.prevHits.push({"row": row, "col": col});
        } else if (hit && sunk) {
            this.prevHits.push({"row": row, "col": col});
            this.#cleanPrevHits({"row": row, "col": col}, length);
        }

        if (this.prevHits.length === 0) {
            this.heatMap.calculateProbability(this.shipLengthsToFind);
        } else {
            this.heatMap.calculateTargetProbability(this.prevHits, this.shipLengthsToFind);
        }
    };


    #cleanPrevHits(sinkingHit, shipLength) {  
        this.#removeShipLength(shipLength);

        if (this.prevHits.length === shipLength) {
            this.prevHits = [];
        } else {
            const shipCoords = this.#getShipCoords(sinkingHit, shipLength);
            this.#removeShipCoords(shipCoords);
        }
    };


    #removeShipCoords(shipCoords) {
        const coordSet = new Set();
        for (let coord of shipCoords) {
            coordSet.add(JSON.stringify(coord));
        }

        const newArray = [];
        for (let hit of this.prevHits) {
            const key = JSON.stringify(hit);
            if (!coordSet.has(key)) {
                newArray.push(hit);
            }
        }

        this.prevHits = newArray;
    };


    #getShipCoords(sinkingHit, shipLength) {
        const directions = [
            {"rowChange": -1, "colChange": 0},
            {"rowChange": 1, "colChange": 0},
            {"rowChange": 0, "colChange": -1},
            {"rowChange": 0, "colChange": 1},
        ];

        for (let direction of directions) {
            const coords = [];
            this.#collectShipCoords(sinkingHit, this.prevHits.slice(), coords, 0, shipLength, direction);
            if (coords.length === shipLength) {
                return coords;
            }
        }
        return null;
    };


    #collectShipCoords(currentHit, prevHits, shipCoords, currentLength, targetlength, posChange) {
        if (currentLength === targetlength) {
            return;
        }

        shipCoords.push(currentHit);

        const neighborHit = {"row": currentHit.row + posChange.rowChange, "col": currentHit.col + posChange.colChange};

        for (let hit of prevHits) {
            if (hit.row === neighborHit.row && hit.col === neighborHit.col) {
                this.#collectShipCoords(hit, prevHits, shipCoords, currentLength + 1, targetlength, posChange);
                break;
            }
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
        return found;
    };


    makeAttack() {
        let attackList = this.heatMap.getBestAttacksList();
        let randomIdx = this.#randInt(0, attackList.length - 1);
        return attackList[randomIdx];
    };
};



export default Computer;
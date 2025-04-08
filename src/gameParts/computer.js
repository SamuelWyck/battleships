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
        this.savedPrevHits = [];
        this.sunkShips = [];
        this.lengthCollsion = false;
        this.searchedLength = 0;
    };


    reset() {
        this.board.clearBoard();
        this.radar.clearBoard();
        this.heatMap.clearBoard();
        this.shipList = [2, 3, 3, 4, 5];
        this.prevHits = [];
        this.savedPrevHits = [];
        this.lengthCollsion = false;
        this.searchedLength = 0;
        this.shipLengthsToFind = [2, 3, 3, 4, 5];
        this.sunkShips = [];
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


    recordAttack(row, col, hit, sunk) {
        this.radar.recordAttack(row, col, hit);
        this.heatMap.recordAttack(row, col, hit);
        this.heatMap.resetProbability();
        if (hit && !sunk) {
            this.prevHits.push({"row": row, "col": col});
        } else if (hit && sunk) {
            this.#cleanPrevHits({"row": row, "col": col});
        }

        if (this.prevHits.length === 0) {
            this.heatMap.calculateProbability(this.shipLengthsToFind);
        } else {
            this.heatMap.calculateTargetProbability(this.prevHits, this.shipLengthsToFind);
        }
    };


    #cleanPrevHits(sinkingHit) {
        
        const shipCoords = this.#getShipCoords(sinkingHit);
        let beforeLength = this.shipLengthsToFind.length;
        let substituteLength = false;

        if (this.lengthCollsion) {
            const [newBefore, newSub] = this.#handleLengthCollision(shipCoords, beforeLength, substituteLength);
            beforeLength = newBefore;
            substituteLength = newSub;
        } else {
            this.#removeShipCoords(shipCoords);
            beforeLength = this.shipLengthsToFind.length;
            this.#removeShipLength(shipCoords.length);
        }


        if (shipCoords.length > 5) {
            const otherShipCoord = this.#findOtherShip(sinkingHit, shipCoords);
            console.log(otherShipCoord)
            this.prevHits.push(otherShipCoord);

        } else if (this.shipLengthsToFind.length === beforeLength) {
            this.#handleCollisionSearch(shipCoords, sinkingHit);

        } else {
            this.sunkShips.push({
                "coords": shipCoords, 
                "length": (substituteLength || shipCoords.length === 2) ? -1 : shipCoords.length, 
                "sinkingHit": sinkingHit,
                "possibleOtherShip": this.#findOtherShip(sinkingHit, shipCoords)
            });
        }
        
    };


    #handleCollisionSearch(shipCoords, sinkingHit) {
        this.savedPrevHits = this.prevHits.slice();
        this.prevHits = [];
        this.lengthCollsion = true;
        this.searchedLength = shipCoords.length;
        this.sunkShips.push({
            "coords": shipCoords, 
            "length": shipCoords.length, 
            "sinkingHit": sinkingHit,
            "possibleOtherShip": this.#findOtherShip(sinkingHit, shipCoords)
        });
        for (let sunkShip of this.sunkShips) {
            if (sunkShip.length !== shipCoords.length) {
                continue;
            }
            this.prevHits.push(sunkShip.possibleOtherShip);
        }
    };


    #handleLengthCollision(shipCoords, beforeLength, substituteLength) {
        const coordSet = new Set();
        for (let coord of shipCoords) {
            coordSet.add(JSON.stringify(coord));
        }
        for (let sunkShip of this.sunkShips) {
            if (sunkShip.length === this.searchedLength && coordSet.has(sunkShip.possibleOtherShip)) {
                sunkShip.length = -1;
                break;
            }
        }
        this.prevHits = this.savedPrevHits.slice();
        this.savedPrevHits = [];
        beforeLength = (shipCoords.length === 2) ? this.shipLengthsToFind.length - 1 : this.shipLengthsToFind.length;
        if (beforeLength === this.shipLengthsToFind.length) {
            this.#removeShipLength(shipCoords.length);
        } else {
            substituteLength = true;
        }
        return [beforeLength, substituteLength];
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


    #getShipCoords(sinkingHit) {
        const coords = [sinkingHit];
        this.#collectShipCoords(sinkingHit, this.prevHits.slice(), coords, null);
        return coords;
    };


    #collectShipCoords(currentHit, hitList, coords, rowChanges) {
        if (hitList.length === 0) {
            return;
        }

        const row = currentHit.row;
        const col = currentHit.col;

        if (rowChanges === null) {
            for (let hit of hitList) {
                const rowChange = Math.abs(row - hit.row);
                const colChange = Math.abs(col - hit.col);
                if ((rowChange === 1 && colChange === 0) || (colChange === 1 && rowChange === 0)) {
                    coords.push(hit);
                    hitList = this.#removeHit(hit, hitList);
                    this.#collectShipCoords(hit, hitList, coords, rowChange === 1);
                    break;
                }
            }
        } else {
            for (let hit of hitList) {
                const rowChange = Math.abs(row - hit.row);
                const colChange = Math.abs(col - hit.col);
                if ((rowChanges && rowChange === 1 && colChange === 0) || 
                    (!rowChanges && colChange === 1 && rowChange === 0)) {
                    coords.push(hit);
                    hitList = this.#removeHit(hit, hitList);
                    this.#collectShipCoords(hit, hitList, coords, rowChanges);
                    break;
                } 
            }
        }
    };


    #removeHit(targetHit, hitList) {
        const newArray = [];
        for (let hit of hitList) {
            if (hit.row === targetHit.row && hit.col === targetHit.col) {
                continue;
            }
            newArray.push(hit);
        }
        return newArray;
    };


    #findOtherShip(sinkingHit, shipCoords) {
        return this.#getPossibleShip(sinkingHit, shipCoords, new Set());
    };


    #getPossibleShip(currentHit, shipCoords, visited) {

        for (let coord of shipCoords) {
            const rowChange = Math.abs(coord.row - currentHit.row);
            const colChange = Math.abs(coord.col - currentHit.col);
            if ((rowChange === 1 || colChange === 1) && !visited.has(JSON.stringify(coord))) {
                visited.add(JSON.stringify(currentHit));
                return this.#getPossibleShip(coord, shipCoords, visited);
            }
        }

        return currentHit;
    };


    #removeShipLength(shipLength) {
        if (shipLength === 2) {
            return true;
        }
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
        let attack =  attackList[randomIdx];

        if (attack === undefined) {
            if (this.#areAdjacentHits()) {
                this.#handleSkip();
                // this.heatMap.resetProbability();
                // this.heatMap.calculateTargetProbability(this.prevHits, this.shipLengthsToFind);
                // const attackList = this.heatMap.getBestAttacksList();
                // const randomIdx = this.#randInt(0, attackList.length - 1);
                // attack = attackList[randomIdx];
                attack = this.#getNextHit();
                attack = (attack === null) ? undefined : attack;
            }
        }
        if (attack === undefined) {
            this.prevHits = this.savedPrevHits.slice();
            this.savedPrevHits = [];
            this.lengthCollsion = false;
            this.heatMap.resetProbability();
            this.heatMap.calculateProbability(this.shipLengthsToFind);
            attackList = this.heatMap.getBestAttacksList();
            randomIdx = this.#randInt(0, attackList.length - 1);
            return attackList[randomIdx];
        }

        return attack;
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


    #areAdjacentHits() {
        if (this.prevHits.length === 1) {
            return true;
        }

        const savePrevHits = this.prevHits;
        this.prevHits = this.prevHits.slice(1);
        const coords = this.#getShipCoords(savePrevHits[0]);
        this.prevHits = savePrevHits;
        if (coords.length === this.prevHits.length) {
            return true;
        }
        return false;
    };


    #handleSkip() {
        const newHits = [];
        const hitSet = new Set();
        //need to figure out why this method doesnt work
        for (let hit of this.prevHits) {
            hitSet.add(JSON.stringify(hit));
            const upperRow = hit.row - 1;
            const lowerRow = hit.row + 1;
            const leftCol = hit.col - 1;
            const rightCol = hit.col + 1;

            if (0 <= upperRow && upperRow < this.board.board.length) {
                const pos = this.board.board[upperRow][hit.col];
                if (pos === this.board.hitSymbol) {
                    newHits.push({"row": upperRow, "col": hit.col});
                }
            }
            if (0 <= lowerRow && lowerRow < this.board.board.length) {
                const pos = this.board.board[lowerRow][hit.col];
                if (pos === this.board.hitSymbol) {
                    newHits.push({"row": lowerRow, "col": hit.col});
                }
            }
            if (0 <= leftCol && leftCol < this.board.board.length) {
                const pos = this.board.board[hit.row][leftCol];
                if (pos === this.board.hitSymbol) {
                    newHits.push({"row": hit.row, "col": leftCol});
                }
            }
            if (0 <= rightCol && rightCol < this.board.board.length) {
                const pos = this.board.board[hit.row][rightCol];
                if (pos === this.board.hitSymbol) {
                    newHits.push({"row": hit.row, "col": rightCol});
                }
            }
        }


        for (let newHit of newHits) {
            if (!hitSet.has(JSON.stringify(newHit))) {
                this.prevHits.push(newHit);
            }
        }
        console.log(newHits)
        console.log(this.prevHits)
    };
};



export default Computer;
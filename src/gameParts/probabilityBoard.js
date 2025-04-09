import BoardCell from "./probabilityBoardCell";


class ProbabilityBoard {

    constructor() {
        this.board = [
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
        ];
    };


    #cell() {
        return new BoardCell();
    };


    recordAttack(row, col, hit) {
        const rowValid = 0 <= row && row < this.board.length;
        const colValid = 0 <= col && col < this.board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }

        const cell = this.board[row][col];
        if (hit) {
            cell.hit = true;
        } else {
            cell.miss = true;
        }
        return true;
    };


    clearBoard() {
        this.board = [
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
            [this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell(), this.#cell()],
        ];
    };


    resetProbability() {
        for (let row = 0; row < this.board.length; row += 1) {
            for (let col = 0; col < this.board[0].length; col += 1) {
                const cell = this.board[row][col];
                cell.resetHuntWeight();
            }
        }
    };


    calculateProbability(shipList) {
        for (let ship of shipList) {
            this.#calcHorizontalProbability(ship);
            this.#calcVerticalProbability(ship);
        }
    };


    #calcHorizontalProbability(shipLength) {
        const posChange = {"rowChange": 0, "colChange": 1};
        for (let row = 0; row < this.board.length; row += 1) {
            for (let col = 0; col <= this.board[row].length - shipLength; col += 1) {
                this.#calcWeight(row, col, 1, shipLength, posChange);
            }
        }
    };


    #calcVerticalProbability(shipLength) {
        const posChange = {"rowChange": 1, "colChange": 0};
        for (let row = 0; row <= this.board.length - shipLength; row += 1) {
            for (let col = 0; col < this.board[0].length; col += 1) {
                this.#calcWeight(row, col, 1, shipLength, posChange);
            }
        }
    };


    #calcWeight(row, col, currentLength, targetlength, posChange) {
        const rowValid = 0 <= row && row < this.board.length;
        const colValid = 0 <= col && col < this.board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }

        const cell = this.board[row][col];
        if (cell.hit || cell.miss) {
            return false;
        }
        if (currentLength === targetlength) {
            cell.increaseHuntWeight();
            return true;
        }

        const newRow = row + posChange.rowChange;
        const newCol = col + posChange.colChange;
        const success = this.#calcWeight(newRow, newCol, currentLength + 1, targetlength, posChange);
        if (success) {
            cell.increaseHuntWeight();
        }
        return success;
    };


    calculateTargetProbability(hitList, shipList) {
        for  (let ship of shipList) {
            for (let hit of hitList) {
                this.#calcHorizontalHitProb(hit.row, hit.col, ship);
                this.#calcVerticalHitProb(hit.row, hit.col, ship);
            }
        }

        for (let row = 0; row < this.board.length; row += 1) {
            for (let col = 0; col < this.board[0].length; col += 1) {
                const cell = this.board[row][col];
                if (cell.hit) {
                    cell.resetHuntWeight();
                }
            }
        }
    };


    #calcHorizontalHitProb(row, col, shipLength) {
        const posChange = {"rowChange": 0, "colChange": 1};
        for (let newCol = col; newCol > col - shipLength; newCol -= 1) {
            this.#calcHitWeight(row, newCol, 1, shipLength, posChange);
        }
    };


    #calcVerticalHitProb(row, col, shipLength) {
        const posChange = {"rowChange": 1, "colChange": 0};
        for (let newRow = row; newRow > row - shipLength; newRow -= 1) {
            this.#calcHitWeight(newRow, col, 1, shipLength, posChange);
        }
    };


    #calcHitWeight(row, col, currentLength, targetlength, posChange) {
        const rowValid = 0 <= row && row < this.board.length;
        const colValid = 0 <= col && col < this.board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }

        const cell = this.board[row][col];
        const key = JSON.stringify({"row": row, "col": col});
        if (cell.miss) {
            return false;
        }
        if (currentLength === targetlength) {
            cell.increaseHuntWeight();
            return true;
        }

        const newRow = row + posChange.rowChange;
        const newCol = col + posChange.colChange;
        const success = this.#calcHitWeight(newRow, newCol, currentLength + 1, targetlength, posChange);
        if (success) {
            cell.increaseHuntWeight();
        }
        return success;
    };


    getBestAttacksList() {
        let attackList = [];
        let maxWeight = 1;

        for (let row = 0; row < this.board.length; row += 1) {
            for (let col = 0; col < this.board[0].length; col += 1) {
                const cell = this.board[row][col];
                if (cell.huntWeight > maxWeight) {
                    maxWeight = cell.huntWeight;
                    attackList = [];
                    attackList.push({"row": row, "col": col});
                } else if (cell.huntWeight === maxWeight) {
                    attackList.push({"row": row, "col": col});
                }
            }
        }

        return attackList;
    };
};


export default ProbabilityBoard;

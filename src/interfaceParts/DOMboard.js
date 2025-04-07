

class BoardInterface {

    constructor(parent, boardClassName, coordCellClassName, cellClassName, markerClassName) {
        this.containerDiv = parent;
        this.board = this.#createElement("div", boardClassName);
        this.width = 11;
        this.height = 11;
        this.letterCoords = [
            "A", "B", "C", "D", "E", 
            "F", "G", "H", "I", "j",
        ];
        this.numberCoords = [
            1, 2, 3, 4, 5,
            6, 7, 8, 9, 10,
        ];
        this.boardClassName = boardClassName;
        this.coordCellClassName = coordCellClassName;
        this.cellClassName = cellClassName;
        this.markerClassName = markerClassName
    };


    #createElement(element, className=null) {
        const ele = document.createElement(element);
        if (className !== null) {
            ele.classList.add(className);
        }
        return ele;
    };


    createBoard() {
        this.board.innerHTML = "";
        let letterIdx = 0;
        let numberIdx = 0;
        for (let i = 0; i < this.width * this.height; i += 1) {
            const row = Math.floor(i / this.height) - 1;
            const col = i % this.width - 1;

            if (i === 0) {
                this.board.appendChild(this.#createCoordCell("", row, col));
            } else if (i < this.width) {
                const letter = this.letterCoords[letterIdx];
                this.board.appendChild(this.#createCoordCell(letter));
                letterIdx += 1;
            } else if (i % this.width === 0 && i / this.width < this.height) {
                const number = this.numberCoords[numberIdx];
                this.board.appendChild(this.#createCoordCell(number));
                numberIdx += 1;
            } else {
                this.board.appendChild(this.#createCell(row, col));
            }
        }

        this.containerDiv.innerHTML = "";
        this.containerDiv.appendChild(this.board);
    };


    #createCoordCell(symbol) {
        const cell = this.#createElement("div", this.coordCellClassName);
        cell.textContent = symbol;
        return cell;
    };


    #createCell(row, col) {
        const cell = this.#createElement("div", this.cellClassName);
        cell.dataset.row = row;
        cell.dataset.col = col;
        const marker = this.#createElement("div", this.markerClassName);
        cell.appendChild(marker);
        return cell;
    };


    placeShips(shipElements, playerBoard, horizontalClass) {
        const placedShips = new Set();

        for (let row = 0; row < playerBoard.length; row += 1) {
            for (let col = 0; col < playerBoard[row].length; col += 1) {
                const local = playerBoard[row][col];
                if (local !== 0 && !placedShips.has(local)) {
                    const horizontal = this.#isHorizontal(row, col, playerBoard);
                    this.#placeShip(shipElements, row, col, horizontal, horizontalClass, playerBoard);
                    placedShips.add(local);
                    if (placedShips.length === 5) {
                        return;
                    }
                }
            }
        }
    };


    #placeShip(shipElements, row, col, horizontal, horizontalClass, playerBoard) {
        const boardCell = document.querySelector(`.${this.cellClassName}[data-row="${row}"][data-col="${col}"]`);
        const ship = playerBoard[row][col];
        const shipLength = String(ship.length);

        let shipToPlace = null;
        for (let shipEle of shipElements) {
            if (shipEle.dataset.length === shipLength) {
                shipToPlace = shipEle;
                shipEle.remove();
                break;
            }
        }

        if (horizontal) {
            shipToPlace.classList.add(horizontalClass);
        }
        boardCell.appendChild(shipToPlace);
    };


    #isHorizontal(row, col, playerBoard) {
        const ship = playerBoard[row][col];
        const newCol = col + 1;
        const newColValid = 0 <= newCol && newCol < playerBoard[0].length;
        if (!newColValid) {
            return false;
        }
        if (playerBoard[row][newCol] === ship) {
            return true;
        }
        return false;
    };
};


export default BoardInterface;
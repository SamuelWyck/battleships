

class BoardInterface {

    constructor(boardClassName, coordCellClassName, cellClassName, markerClassName) {
        this.containerDiv = document.querySelector(".board-container");
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
        const board = this.#createElement("div", "board");

        let letterIdx = 0;
        let numberIdx = 0;
        for (let i = 0; i < this.width * this.height; i += 1) {
            const row = Math.floor(i / this.height) - 1;
            const col = i % this.width - 1;

            if (i === 0) {
                board.appendChild(this.#createCoordCell("", row, col));
            } else if (i < this.width) {
                const letter = this.letterCoords[letterIdx];
                board.appendChild(this.#createCoordCell(letter));
                letterIdx += 1;
            } else if (i % this.width === 0 && i / this.width < this.height) {
                const number = this.numberCoords[numberIdx];
                board.appendChild(this.#createCoordCell(number));
                numberIdx += 1;
            } else {
                board.appendChild(this.#createCell(row, col));
            }
        }

        this.containerDiv.innerHTML = "";
        this.containerDiv.appendChild(board);
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
};


export default BoardInterface;
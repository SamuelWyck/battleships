import Board from "./board.js";
import Radar from "./radar.js";


class Player {

    constructor() {
        this.shipList = [2, 3, 3, 4, 5];
        this.radar = new Radar();
        this.board = new Board();
    };


    reset() {
        this.board.clearBoard();
        this.radar.clearBoard();
        this.shipList = [2, 3, 3, 4, 5];
    };


    placeShip(length, row, col, horizontal) {
        if (this.board.placeShip(length, row, col, horizontal)) {
            this.#updateShipList(length, true);
            return true;
        }
        return false;
    };


    removeShip(row, col) {
        const ship = this.board.removeShip(row, col);
        if (typeof ship === "number") {
            return false;
        }
        this.#updateShipList(ship.length, false);
        return true;
    };


    #updateShipList(ship, remove=false) {
        if (remove) {
            const newArray = [];
            let found = false;
            for (let oldShip of this.shipList) {
                if (oldShip === ship && !found) {
                    found = true;
                    continue;
                }
                newArray.push(oldShip);
            }
            this.shipList = newArray;
        } else {
            this.shipList.push(ship);
        }
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
};


export default Player;
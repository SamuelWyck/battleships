import Board from "./board.js";
import Radar from "./radar.js";


class Player {

    constructor() {
        this.shipList = [2, 3, 3, 4, 5];
        this.radar = new Radar();
        this.board = new Board();
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

};


export default Player;
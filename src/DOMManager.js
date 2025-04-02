import BoardInterface from "./interfaceParts/DOMboard.js";
import ShipInterface from "./interfaceParts/shipContainer.js";


class DOMManager {

    constructor() {
        const boardDiv = document.querySelector(".board-container");
        this.ocean = new BoardInterface(boardDiv, "board", "board-coord-cell", "board-cell", "board-cell-marker");
        this.ocean.createBoard()

        const radarDiv = document.querySelector(".radar-container");
        this.radar = new BoardInterface(radarDiv, "radar", "radar-coord-cell", "radar-cell", "radar-cell-marker")
        this.radar.createBoard()

        const shipContainer = document.querySelector(".ships-container");
        this.shipsContainer = new ShipInterface(shipContainer);
        this.shipsContainer.createContainer();

        this.switchPlayerBtn = document.querySelector(".switch-btn");
    };


    headerBtnClickEvent(callback) {
        const nav = document.querySelector("nav");
        nav.addEventListener("click", function(event) {
            callback(event);
        });
    };


    interfaceBtnClickEvent(callback) {
        const gameDiv = document.querySelector(".game-btns");
        gameDiv.addEventListener("click", function(event) {
            callback(event);
        });
    };


    radarClickEvent(callback) {
        this.radar.board.addEventListener("click", function(event) {
            callback(event);
        });
    };


    oceanDragOverEvent() {
        this.ocean.board.addEventListener("dragover", function(event) {
            event.preventDefault();
        });
    };


    oceanDropEvent(callback) {
        this.ocean.board.addEventListener("drop", function(event) {
            callback(event);
        });
    };


    shipDragEvent(callback) {
        this.shipsContainer.addEventListener("drag", function(event) {
            if (event.target.matches(".ship")) {
                callback(event.target);
            }
        });
        this.ocean.board.addEventListener("drag", function(event) {
            if (event.target.matches(".ship")) {
                callback(event.target);
            }
        });
    };
};


export default DOMManager;

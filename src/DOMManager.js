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

        this.computerBtn = document.querySelector(".computer-choice-btn");
    };


    playingAgainstComputer() {
        return this.computerBtn.classList.contains("choice-selected");
    };


    updateOcean(row, col, hit) {
        for (let child of this.ocean.board.children) {
            if (!child.matches(".board-cell")) {
                continue;
            }

            if (Number(child.dataset.row) === row && Number(child.dataset.col) === col) {
                const marker = child.firstChild;
                console.log(marker);
                if (hit) {
                    marker.classList.add("hit");
                } else {
                    marker.classList.add("miss");
                }
                break;
            }
        }
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
        this.shipsContainer.container.addEventListener("dragover", function(event) {
            event.preventDefault();
        });
    };


    oceanDropEvent(callback) {
        this.ocean.board.addEventListener("drop", function(event) {
            callback(event);
        });
        this.shipsContainer.container.addEventListener("drop", function(event) {
            callback(event);
        });
    };


    shipDragEvent(callback) {
        this.shipsContainer.container.addEventListener("dragstart", function(event) {
            if (event.target.matches(".ship")) {
                callback(event);
            }
        });
        this.ocean.board.addEventListener("dragstart", function(event) {
            if (event.target.matches(".ship")) {
                callback(event);
            }
        });
    };


    shipRotateEvent(callback) {
        document.addEventListener("dblclick", function(event) {
            if (event.target.matches(".ship") && !event.target.parentNode.matches(".ship-container")) {
                callback(event);
            }
        });
    };
};


export default DOMManager;

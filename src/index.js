import "./styles.css";
import BoardInterface from "./interfaceParts/DOMboard.js";
import ShipInterface from "./interfaceParts/shipContainer.js";

const boardDiv = document.querySelector(".board-container");
const board = new BoardInterface(boardDiv, "board", "board-coord-cell", "board-cell", "board-cell-marker");
board.createBoard()

const radarDiv = document.querySelector(".radar-container");
const radar = new BoardInterface(radarDiv, "radar", "radar-coord-cell", "radar-cell", "radar-cell-marker")
radar.createBoard()

const shipContainer = document.querySelector(".ships-container");
const ships = new ShipInterface(shipContainer);
ships.createContainer();
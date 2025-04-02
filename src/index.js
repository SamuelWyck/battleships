import "./styles.css";
import DOMManager from "./DOMManager.js";
import Player from "./gameParts/player.js";
import Computer from "./gameParts/computer.js";


const game = (function() {

    const manager = new DOMManager();
    manager.shipDragEvent(shipDrag);
    manager.oceanDragOverEvent();
    manager.oceanDropEvent(shipDrop);
    manager.shipRotateEvent(shipRotate);

    const playerOne = new Player();
    const playerTwo = new Computer();

    const gameStarted = false;


    function shipDrag(event) {
        if (!gameStarted) {
            event.dataTransfer.clearData();
            event.dataTransfer.setData("text", event.target.id);
        }
    };


    function shipDrop(event) {
        event.preventDefault();
        if (!gameStarted) {
            if (event.target.matches(".ship") || event.target.matches(".board-coord-cell")) {
                return;
            }

            const shipId = event.dataTransfer.getData("text");

            if (event.target.matches(".ship-container")) {
                const ship = document.getElementById(shipId);
                ship.classList.remove("horizontal");
                event.target.appendChild(ship);
            } else {
                const target = (event.target.classList.contains("board-cell-marker")) ? event.target.parentNode : event.target;
                target.appendChild(document.getElementById(shipId));
            }
        }
    };


    function shipRotate(event) {
        if (!gameStarted) {
            event.target.classList.toggle("horizontal");
        }
    }
})();
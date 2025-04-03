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
    manager.radarClickEvent(playerGuess);
    manager.interfaceBtnClickEvent(interfaceBtnClick);

    const playerOne = new Player();
    let playerTwo = new Computer();

    let gameStarted = false;


    function shipDrag(event) {
        if (!gameStarted) {
            event.dataTransfer.clearData();
            event.dataTransfer.setData("text", event.target.id);
            event.target.classList.add("lower-element");
        }
    };


    function shipDrop(event) {
        event.preventDefault();
        if (!gameStarted) {
            const shipId = event.dataTransfer.getData("text");
            const ship = document.getElementById(shipId);
            ship.classList.remove("lower-element");

            if (event.target.matches(".board-coord-cell")) {
                return;
            }

            const lowerElement = getLowerElement(event);
            const target = (event.target.matches(".ship")) ? lowerElement : event.target;

            if (target.matches(".ship-container")) {
                ship.classList.remove("horizontal");
                removeShip(ship);
                target.appendChild(ship);
            } else {
                const shipData = saveShipData(ship);
                removeShip(ship);
                const shipPlaced = placeShip(target, ship);
                if (shipPlaced) {
                    target.appendChild(ship);
                } else {
                    replaceShip(shipData);
                }
            }
        }
    };


    function shipRotate(event) {
        if (!gameStarted) {
            const shipData = saveShipData(event.target);
            removeShip(event.target);
            const shipPlaced = playerOne.placeShip(
                shipData.length, 
                shipData.row,
                shipData.col, 
                !shipData.horizontal
            );
            if (shipPlaced) {
                event.target.classList.toggle("horizontal");
            } else {
                playerOne.placeShip(
                    shipData.length, 
                    shipData.row,
                    shipData.col, 
                    shipData.horizontal
                );
            }
        }
    };

    //might remove this
    // function getShipFrontTarget(ship, event) {
    //     const rect = ship.getBoundingClientRect();
    //     let frontX = (ship.classList.contains("horizontal")) ? event.clientX - (event.clientX - rect.left): event.clientX;
    //     let frontY = (ship.classList.contains("horizontal")) ? event.clientY : event.clientY - (event.clientY - rect.top);
    //     const elements = document.elementsFromPoint(frontX, frontY);
    //     console.log(frontX)
    //     console.log(event.clientX)
    //     console.log(elements)
    // };


    function getLowerElement(event) {
        const x = event.clientX;
        const y = event.clientY;
        const elements = document.elementsFromPoint(x, y);
        return elements[1];
    };


    function saveShipData(ship) {
        const length = Number(ship.dataset.length);
        const row = Number(ship.parentNode.dataset.row);
        const col = Number(ship.parentNode.dataset.col);
        const horizontal = ship.classList.contains("horizontal");
        return {"row": row, "col": col, "length": length, "horizontal": horizontal};
    };


    function placeShip(target, ship) {
        const row = Number(target.dataset.row);
        const col = Number(target.dataset.col);
        const length = Number(ship.dataset.length);
        const horizontal = ship.classList.contains("horizontal");
        return playerOne.placeShip(length, row, col, horizontal);
    };


    function replaceShip(shipData) {
        playerOne.placeShip(
            shipData.length, 
            shipData.row, 
            shipData.col, 
            shipData.horizontal
        );
    };


    function removeShip(ship) {
        if (ship.parentNode.classList.contains("ship-container")) {
            return;
        }
        const row = Number(ship.parentNode.dataset.row);
        const col = Number(ship.parentNode.dataset.col);
        playerOne.removeShip(row, col);
    };


    function playerGuess(event) {
        if (!gameStarted || !event.target.matches(".radar-cell")) {
            return false;
        }

        const marker = event.target.firstChild;
        if (marker.matches(".miss") || marker.matches(".hit")) {
            return false;
        }

        const row = Number(event.target.dataset.row);
        const col = Number(event.target.dataset.col);
        const [hit, shipSunk] = playerTwo.board.receiveAttack(row, col);
        if (hit) {
            marker.classList.add("hit");
        } else {
            marker.classList.add("miss");
        }
        playerOne.radar.recordAttack(row, col, hit);
        if (manager.playingAgainstComputer()) {
            computerGuess();
        }
    };


    function computerGuess() {
        const attack = playerTwo.makeAttack();
        const [hit, shipSunk] = playerOne.board.receiveAttack(attack.row, attack.col);
        playerTwo.recordAttack(attack.row, attack.col, hit, shipSunk);
        manager.updateOcean(attack.row, attack.col, hit);
    };


    function interfaceBtnClick(event) {
        if (event.target.matches(".switch-btn")) {

        } else if (event.target.matches(".new-game-btn")) {

        } else if (event.target.matches(".start-btn") && !gameStarted) {
            if (playerOne.board.ships.length === 5) {
                playerTwo.placeShips();
                console.log(playerTwo.board.board)
                gameStarted = true;
            }
        } else if (event.target.matches(".random-btn")) {

        }
    };
})();
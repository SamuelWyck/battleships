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

    const player = new Player();
    const computer = new Computer();

    let gameStarted = false;
    let gameOver = false;


    function shipDrag(event) {
        if (!gameStarted) {
            event.dataTransfer.clearData();
            const offset = getMouseOffset(event);
            event.dataTransfer.setData("offset", JSON.stringify(offset));
            event.dataTransfer.setData("text", event.target.id);
        }
    };


    function getMouseOffset(event) {
        const rect = event.target.getBoundingClientRect();
        const isHorizontal = event.target.matches(".horizontal");
        const paddingPxs = 25;
        
        const yOffset = (isHorizontal) ? event.clientY - (rect.top + (rect.height / 2)) :
            event.clientY - rect.top - paddingPxs;
        const xOffset = (isHorizontal) ? event.clientX - rect.left - paddingPxs : 
            event.clientX - (rect.left + (rect.width / 2));
        return {
            "yOffset": yOffset,
            "xOffset": xOffset,
        };
    };


    function shipDrop(event) {
        event.preventDefault();
        if (!gameStarted) {
            const shipId = event.dataTransfer.getData("text");
            const ship = document.getElementById(shipId);
            const offset = JSON.parse(event.dataTransfer.getData("offset"));
            const target = getDropTarget(event, offset);

            if (!target.matches(".board-cell") && !target.matches(".ship-container")) {
                return;
            }

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


    function getDropTarget(event, offset) {
        const x = event.clientX - offset.xOffset;
        const y = event.clientY - offset.yOffset;
        const elements = document.elementsFromPoint(x, y);
        const targetEle = (elements[0].matches(".ship")) ? elements[1] : elements[0];
        return targetEle;
    };


    function shipRotate(event) {
        if (!gameStarted) {
            const shipData = saveShipData(event.target);
            removeShip(event.target);
            const shipPlaced = player.placeShip(
                shipData.length, 
                shipData.row,
                shipData.col, 
                !shipData.horizontal
            );
            if (shipPlaced) {
                event.target.classList.toggle("horizontal");
            } else {
                player.placeShip(
                    shipData.length, 
                    shipData.row,
                    shipData.col, 
                    shipData.horizontal
                );
            }
        }
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
        return player.placeShip(length, row, col, horizontal);
    };


    function replaceShip(shipData) {
        player.placeShip(
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
        player.removeShip(row, col);
    };


    function playerGuess(event) {
        if (!gameStarted || !event.target.matches(".radar-cell")) {
            return;
        }
        if (gameOver) {
            return;
        }

        const marker = event.target.firstChild;
        if (marker.matches(".miss") || marker.matches(".hit")) {
            return;
        }

        const row = Number(event.target.dataset.row);
        const col = Number(event.target.dataset.col);
        const [hit, shipSunk, ship] = computer.board.receiveAttack(row, col);
        if (hit) {
            marker.classList.add("hit");
            if (shipSunk) {
                if (checkGameOver(computer)) {
                    manager.showPopup("Player Wins!");
                    gameOver = true;
                } else {
                    manager.showPopup("Ship Sunk!")
                }
            } 
        } else {
            marker.classList.add("miss");
        }
        player.radar.recordAttack(row, col, hit);
        computerGuess();
    };


    function computerGuess() {
        const attack = computer.makeAttack();
        const [hit, shipSunk, ship] = player.board.receiveAttack(attack.row, attack.col);
        computer.recordAttack(attack.row, attack.col, hit, shipSunk, ship);
        manager.updateOcean(attack.row, attack.col, hit);
        if (checkGameOver(player)) {
            manager.showPopup("Computer Wins!");
            gameOver = true;
        }
    };


    function checkGameOver(player) {
        return player.board.allShipsSunk();
    };


    function interfaceBtnClick(event) {
        if (event.target.matches(".new-game-btn")) {
            handleNewGame();
        } else if (event.target.matches(".start-btn") && !gameStarted) {
            handleStartGame();
        } else if (event.target.matches(".random-btn")) {

        }
    };


    function handleStartGame() {
        if (player.board.ships.length === 5) {
            computer.placeShips();
            gameStarted = true;
        } else {
            manager.showPopup("Place All Ships")
        }
    };


    function handleNewGame() {
        player.reset();
        computer.reset();
        manager.clearOceanBoard();
        manager.clearRadarBoard();
        gameStarted = false;
        gameOver = false
    };
})();
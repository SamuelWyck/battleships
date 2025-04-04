

class ShipInterface {

    constructor(parent) {
        this.container = document.createElement("div");
        this.container.classList.add("ship-container")
        this.parentDiv = parent;
        this.ships = [
            {"class": "carrier", "length": 5},
            {"class": "battleship", "length": 4},
            {"class": "destroyer", "length": 3},
            {"class": "submarine", "length": 3},
            {"class": "patrol-boat", "length": 2},
        ];
    };


    createContainer() {
        this.container.innerHTML = "";
        for (let i = 0; i < this.ships.length; i += 1) {
            const ship = this.ships[i];
            this.container.appendChild(this.#createShip(ship));
        }
        this.parentDiv.innerHTML = "";
        this.parentDiv.appendChild(this.container);
    };


    #createShip(ship) {
        const shipDiv = document.createElement("div");
        const socketDiv = document.createElement("div");
        socketDiv.classList.add("socket");
        shipDiv.classList.add(ship.class);
        shipDiv.id = ship.class;
        shipDiv.classList.add("ship");
        shipDiv.dataset.length = ship.length;
        shipDiv.setAttribute("draggable", true);
        shipDiv.appendChild(socketDiv);
        return shipDiv;
    };
};


export default ShipInterface;
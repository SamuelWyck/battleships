import Ship from "./src/gameParts/ship.js"

const ship = new Ship(5);

it("length works", function() {
    expect(ship.length).toBe(5);
});

it("hit works", function() {
    ship.hit();
    expect(ship.hits).toBe(1);
});

it("isSunk works", function() {
    expect(ship.isSunk()).toBe(false);
});
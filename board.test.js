import Board from "./src/gameParts/board.js";

const board = new Board();

it("placeShip works (1)", function() {
    expect(board.placeShip(2, 0, 0, false)).toBe(true);
});

it("placeShip works (2)", function() {
    expect(board.placeShip(2, 9, 0, false)).toBe(false);
});

it("receiveAttack works (1)", function() {
    expect(board.receiveAttack(-1, 10)).toBe(null);
});

it("receiveAttack works (2)", function() {
    expect(board.receiveAttack(0, 0)).toBe(true);
    expect(board.receiveAttack(0, 0)).toBe(null);
});

it("allShipsSunk works", function() {
    expect(board.allShipsSunk()).toBe(false);
});
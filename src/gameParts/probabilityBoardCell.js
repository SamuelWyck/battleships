

class BoardCell {

    constructor() {
        this.miss = false;
        this.hit = false;
        this.huntWeight = 0;
    };


    increaseHuntWeight() {
        this.huntWeight += 1;
    };


    resetHuntWeight() {
        this.huntWeight = 0;
    };
};


export default BoardCell;
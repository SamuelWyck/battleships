

class BoardCell {

    constructor() {
        this.miss = false;
        this.hit = false;
        this.weight = 0;
    };


    increaseWeight() {
        this.weight += 1;
    };


    resetWeight() {
        this.weight = 0;
    };
};


export default BoardCell;
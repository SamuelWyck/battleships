

class BoardCell {

    constructor() {
        this.miss = false;
        this.hit = false;
        this.huntWeight = 0;
        this.targetWeight = 0;
    };


    increaseHuntWeight() {
        this.huntWeight += 1;
    };


    increaseTargetWeight() {
        this.targetWeight += 1;
    };


    resetHuntWeight() {
        this.huntWeight = 0;
    };


    resetTargetWeight() {
        this.targetWeight = 0;
    };
};


export default BoardCell;
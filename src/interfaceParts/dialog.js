

class Dialog {

    constructor(dialogClass, hideClass) {
        this.parent = document.querySelector("body");
        this.dialog = document.createElement("div");
        this.dialog.classList.add(dialogClass);
        this.dialog.classList.add(hideClass);

        this.hideClass = hideClass;

        this.dragText = "Click and drag ships to place them on the ocean board.";
        this.rotateText = "Double click any ship on the ocean board to rotate it about its front.";
        this.guessText = "Once the game is started, click on the radar to make a guess. Red is a hit, white is a miss.";
        this.compGuessText = "The computer's guesses will be shown on the ocean board.";
        this.goalText = "The first to sink all the other player's ships wins.";

        this.textList = [
            this.dragText, 
            this.rotateText, 
            this.guessText,
            this.compGuessText,
            this.goalText,
        ];
    };


    #createElement(element, className=null) {
        const ele = document.createElement(element);
        if (className !== null) {
            ele.classList.add(className);
        }
        return ele;
    };


    #createListElement(text, className=null) {
        const item = this.#createElement("li", className);
        item.textContent = text;
        return item;
    };


    #createExitBtn() {
        const div = this.#createElement("div", "exit-btn-div");
        const btn = this.#createElement("button");
        btn.textContent = "X";
        div.appendChild(btn);
        return div;
    };


    createDialog() {
        this.dialog.appendChild(this.#createExitBtn());
        
        const infoList = this.#createElement("ol");

        for (let text of this.textList) {
            infoList.appendChild(this.#createListElement(text));
        }

        this.dialog.appendChild(infoList);
        this.parent.appendChild(this.dialog);
    };


    showDialog() {
        this.dialog.classList.remove(this.hideClass);
    };


    hideDialog() {
        this.dialog.classList.add(this.hideClass);
    };


    createExitEventListener() {
        this.dialog.addEventListener("click", function(event) {
            if (event.target.matches("button")) {
                this.hideDialog();
            }
        }.bind(this));
    };
};


export default Dialog;
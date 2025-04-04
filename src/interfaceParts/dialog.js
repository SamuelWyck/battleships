

class Dialog {

    constructor(dialogClass, hideClass) {
        this.parent = document.querySelector("body");
        this.dialog = document.createElement("div");
        this.dialog.classList.add(dialogClass);
        this.dialog.classList.add(hideClass);

        this.hideClass = hideClass;

        this.dragText = "1. Click and drag ships to place them on the ocean board.";
        this.rotateText = "2. Double click any ship on the ocean board to rotate it about its front.";
        this.guessText = "3. Once the game is started, click on the radar to make a guess. Red is a hit, white is a miss.";
        this.compGuessText = "4. The computer's guesses will be shown on the ocean board.";
        this.goalText = "5. The first to sink all of the other player's ships wins.";

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


    #createPara(text, className=null) {
        const para = this.#createElement("p", className);
        para.textContent = text;
        return para;
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
        
        const infoDiv = this.#createElement("div");

        for (let text of this.textList) {
            infoDiv.appendChild(this.#createPara(text));
        }

        this.dialog.appendChild(infoDiv);
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
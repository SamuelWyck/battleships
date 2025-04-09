

class PopUp {

    constructor(popupClass, hideClass) {
        this.parent = document.querySelector("body");
        this.popup = document.createElement("span");
        this.popup.classList.add(popupClass);
        this.popup.classList.add(hideClass);
        this.hideClass = hideClass;
    };


    createPopup() {
        this.parent.appendChild(this.popup);
    };


    showPopup(text=null) {
        if (!this.popup.classList.contains(this.hideClass)) {
            return false;
        }
        if (text === null) {
            return false;
        }

        this.popup.textContent = text;

        this.popup.classList.remove(this.hideClass);
        return true;
    };


    hidePopup() {
        this.popup.classList.add(this.hideClass);
    };


    isShowing() {
        return !this.popup.classList.contains(this.hideClass);
    }
};


export default PopUp;
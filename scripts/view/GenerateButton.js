import ViewComponent from "./ViewComponent.js";

export default class GenerateButton extends ViewComponent {
    #DOMElement
    /**
     * @param {HTMLButtonElement} DOMElement
     */
    constructor(DOMElement) {
        super();
        this.#DOMElement = DOMElement
    }

    enable() {
        this.#DOMElement.setAttribute("disabled", false)
    }

    disable() {
        this.#DOMElement.setAttribute("disabled", true)
    }
}
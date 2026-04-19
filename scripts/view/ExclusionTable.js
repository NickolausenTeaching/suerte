import { range } from "../lib/utils.js"
import ViewComponent from "./ViewComponent.js"

export default class ExclusionTable extends ViewComponent {
    
    constructor(initialCells = []) {
        /**
         * @type ExclusionTableCell[]
         */
        super()
        this.cells = Array.of(...initialCells)
    }

    draw() {
        const numberTablePlaceholder = document.getElementById("numberTable")
        numberTablePlaceholder.innerHTML = ""
        this.cells.forEach(cell => {
            cell.draw()
        })
    }
}

export class ExclusionTableCell extends ViewComponent {
    #number; #isChecked
    #onChangeCallback
    /**
     * @param {(n: number, s: boolean) => void} onChangeCallback
     * @param {number} number 
     * @param {boolean} state 
     */
    constructor(onChangeCallback, number, state = false) {
        super()
        this.#onChangeCallback = onChangeCallback
        this.#number = number
        this.#isChecked = state
    }

    reset() {
        this.#isChecked = false
    }

    check() {
        this.#isChecked = true
    }

    isChecked() {
        return this.#isChecked
    }

    draw() {
        const checkContainer = document.createElement("li")
        checkContainer.classList.add("numberItemCheckboxContainer", "d-flex", "flex-row", "align-items-center", "justify-content-center")

        const checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox")
        checkbox.checked = this.isChecked()
        checkbox.setAttribute("data-number", this.#number)
        checkbox.classList.add("numberItemCheckbox")
        checkbox.addEventListener("change", (e) => {
            this.#onChangeCallback(this.#number, e.target.checked) 
        })

        const numberText = document.createElement("span")
        numberText.classList.add("scary", "fs-1", "d-inline-block", "ps-2")
        numberText.innerText = this.#number.toString().padStart(2, "0")

        checkContainer.appendChild(checkbox)
        checkContainer.appendChild(numberText)
        
        const numberTablePlaceholder = document.getElementById("numberTable")
        numberTablePlaceholder.appendChild(checkContainer)
    }
}
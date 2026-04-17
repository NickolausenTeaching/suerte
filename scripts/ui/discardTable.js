import { range } from "../lib/utils.js"

export class DiscardTable {
    constructor() {
        /**
         * @type Cell[]
         */
        this.cells = []
    }

    update(min, max) {
        const old = Array.of(...this.cells)
        this.cells = []
        range(min, max).forEach((n, i) => {
            if (old.map(cell => cell.number).includes(n)) {
                this.addCell(old.find(cell => cell.number === n))
            } else {
                this.addCell(new Cell(n))
            }
        })
    }

    addCell(cell) {
        this.cells.push(cell)
    }

    get() {
        return Array.of(...this.cells)
    }

    reset() {
        this.cells.forEach(cell => {
            cell.reset()
        })
    }
    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns 
     */
    draw(min, max) {
        min = Number(min)
        max = Number(max)
        if (max < min) {
            console.log(`Scambio [min: ${min}, max: ${max}]`)
            [ min, max ] = [ max, min ]
        }
        const numberTable = []
        this.cells.forEach(cell => {
            const checkContainer = document.createElement("div")
            checkContainer.classList.add("col", "d-flex", "flex-row", "align-items-center", "justify-content-center")
    
            const checkbox = document.createElement("input")
            checkbox.setAttribute("type", "checkbox")
            checkbox.checked = cell.isChecked()
            checkbox.setAttribute("data-number", cell.number)
            checkbox.classList.add("numberItem")
    
            const numberText = document.createElement("span")
            numberText.classList.add("scary", "fs-1", "d-inline-block", "ms-3")
            numberText.innerText = cell.number.toString().padStart(2, "0")
    
            checkContainer.appendChild(checkbox)
            checkContainer.appendChild(numberText)
            numberTable.push(checkContainer)
        })
        return numberTable
    }
}

export class Cell {
    #isChecked
    /**
     * 
     * @param {number} number 
     * @param {boolean} state 
     */
    constructor(number, state = false) {
        this.number = Number(number)
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
}
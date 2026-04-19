import ViewComponent from "./ViewComponent.js";
import { endingDurationMS, endingDelta } from "../lib/utils.js";

export default class SuertedTable extends ViewComponent {

    #lastTimeout
    #numbers
    
    constructor() {
        super();
        this.#lastTimeout = null
        this.#numbers = []
    }

    setNumbers(numbers) {
        this.#numbers = [...numbers]
    }

    draw() {
        super.draw()
        this.clear()
        this.#numbers.forEach(number => {
            new SuertedTableCell(number).draw()
        });
    }

    clear() {
        super.clear()
        document.getElementById("suertedNumbersTable").innerHTML = ""
    }
}

class SuertedTableCell extends ViewComponent {
    #number

    constructor(number) {
        super();
        this.#number = number    
    }

    draw() {
        super.draw();
        const numContainer = document.createElement("li")
        numContainer.classList.add("p-3", "display-1", "scary", "text-center")
        numContainer.innerText = this.#number
        document.getElementById("suertedNumbersTable").appendChild(numContainer)
    }
}
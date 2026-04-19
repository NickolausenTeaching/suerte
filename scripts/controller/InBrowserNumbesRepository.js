import NumberRepository from "./NumbersRepository.js";

export default class InBrowserNumbersRepository extends NumberRepository {
    
    #initialState = []
    /**
     *
     */
    constructor() {
        super();
        const previousState = this.load()
        if (typeof previousState === undefined) {
            this.save(this.#initialState)
        }
    }

    load() {
        super.load()
        return JSON.parse(localStorage.getItem("numbers"))
    }

    save(numbers, override = false) {
        super.save(numbers)
        const previousState = this.load()
        if (override || typeof previousState === undefined) {
            localStorage.setItem("numbers", JSON.stringify(numbers))
        } else {
            localStorage.setItem("numbers", JSON.stringify(previousState.concat(numbers)))
        }
    }

    clear() {
        super.clear()
        localStorage.setItem("numbers", JSON.stringify(this.#initialState))
    }
}
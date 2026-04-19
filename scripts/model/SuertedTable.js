export default class Suertable {
    #number; #penaltyAmount
    /**
     * 
     * @param {number} number 
     * @param {number} penaltyAmount 
     */
    constructor(number, penaltyAmount = 1) {
        this.#number = number
        this.#penaltyAmount = penaltyAmount
    }

    getNumber() {
        return this.#number
    }

    getPenalty() {
        return this.#penaltyAmount
    }

    setPenalty(value) {
        this.#penaltyAmount = value
    }
}
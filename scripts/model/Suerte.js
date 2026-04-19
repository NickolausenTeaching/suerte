import "../lib/utils.js"
import Suertable from "./SuertedTable.js";

export default class Suerte {
    #excluded; #suertables
    /**
     *
     * @param {Number[]} excluded 
     * @param {Suertable[]} suertables 
     */
    constructor(excluded = [], suertables = []) {
        this.#suertables = suertables
        this.#excluded = excluded
    }

    /**
     * 
     * @param {number} amount 
     * @returns
     */
    generate(amount = 1) {
        let population = this.#generatePopulation()
        let output = []
        for (let i = 0; i < amount; i++) {
            let extracted = population.randomItem() 
            output.push(extracted)
            population = population.removeItem(extracted)
        }
        return output
    }

    #generatePopulation() {
        let population = []
        for (const suertable of this.#suertables) {
            population = population.concat(Array.from(
                { length: suertable.getPenalty() }, // Array of `penalty` length
                (_) => suertable.getNumber() // Each position is mapped to the number of the penalized student
            ))
        }

        for (const exclude of this.#excluded) {
            population = population.removeItem(exclude)
        }
        return population
    }
}
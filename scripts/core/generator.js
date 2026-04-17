import "../lib/utils.js"

const MIN_DEFAULT = 1
const MAX_DEFAULT = 30

export class Generator {
    /** @type number[] */
    #alreadyGenerated
    /** @type number[] */
    #excludedNumbers
    /** @type number */
    #min
    /** @type number */
    #max

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @param {number[]} excludeNumbers 
     */
    constructor(min = MIN_DEFAULT, max = MAX_DEFAULT, excludeNumbers = []) {
        this.#min = min
        this.#max = max
        this.#excludedNumbers = excludeNumbers
        this.#alreadyGenerated = []
    }

    exclude(...numbers) {
        this.#excludedNumbers = Array.of(new Set(this.#excludedNumbers.concat(numbers)))
    }

    #generateRandom() {
        let generated
        do {
            generated = Math.floor(Math.random() * (this.#max - this.#min + 1)) + this.#min;
            console.log(generated)
        } while (this.#excludedNumbers.includes(generated) || this.#alreadyGenerated.includes(generated));
        this.#markAsGenerated(generated)
        return generated
    }


    generateRandoms(amount) {
        let generated = []
        if (this.#alreadyGenerated.length === this.#max - this.#min) {
            return generated
        }
        if (this.#max - this.#min <= amount) {
            [ ].range(this.#min, this.#max).forEach(num => {
                if (!this.#alreadyGenerated.includes(num)) {
                    generated.push(num)
                }
            })
        } else {
            for (let i = 0; i < amount; i++) {
                generated.push(this.#generateRandom(this.#min, this.#max, this.#excludedNumbers))
            }
        }
        return generated
    }

    #markAsGenerated(number) {
        this.#alreadyGenerated.push(number)
    }

    reset() {
        this.#alreadyGenerated = []
    }

    setMin(val) {
        this.#min = val
    }

    setMax(val) {
        this.#max = val
    }

    isAlreadyGenerated(number) {
        return this.#alreadyGenerated.includes(number)
    }

    canGenerateMore() {
        return this.#alreadyGenerated.length < (this.#max - this.#min + 1)
    }
}
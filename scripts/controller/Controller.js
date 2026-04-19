import { range, waitForAudio } from "../lib/utils.js";
import Suertable from "../model/SuertedTable.js";
import Suerte from "../model/Suerte.js";
import ExclusionTable, { ExclusionTableCell } from "../view/ExclusionTable.js";
import SuertedTable from "../view/SuertedTable.js";
import ControllerError from "./ControllerError.js"
import NumberRepository from "./NumbersRepository.js";
import SuerteLoading from "../view/SuerteLoading.js";

const audios = [
    "public/sounds/far-west.mp3",
    "public/sounds/ghigliottina.mp3",
    "public/sounds/billionaire.mp3",
    "public/sounds/jaws.mp3",
    "public/sounds/vecna-tick.mp3"
]

export class Controller {
    static DEFAULT_AMOUNT = 2
    static DEFAULT_MIN = 1
    static DEFAULT_MAX = 30
    /**
     * @type NumbersRepository
     */
    #numbersRepository
    #min; #max
    #excludedNumbers

    /**
     * 
     * @param {Number} min 
     * @param {Number} max 
     * @param {NumberRepository} numbersRepository 
     */
    constructor(min = Controller.DEFAULT_MIN, max = Controller.DEFAULT_MAX, numbersRepository) {
        this.#min = min
        this.#max = max
        this.#numbersRepository = numbersRepository
        this.#excludedNumbers = this.#numbersRepository.load()
    }
    /**
     * 
     * @param {number} min 
     */
    onMinInput(min) {
        if (min < 0) {
            throw new ControllerError(ControllerError.MESSAGES.negativeValue.concat(`[Min: ${min}]`))
        }
        if (min > this.#max) {
            throw new ControllerError(ControllerError.MESSAGES.invalidValue.concat(`Min cannot be greater than max! [Max: ${max}, Min: ${this.#min}]`))
        }
        this.#min = min
        this.updateViews()
    }

    /**
     * 
     * @param {number} max 
     */
    onMaxInput(max) {
        if (max < 0) {
            throw new ControllerError(ControllerError.MESSAGES.negativeValue.concat(`[Max: ${max}]`))
        }
        if (max < this.#min) {
            throw new ControllerError(ControllerError.MESSAGES.invalidValue.concat(`Max cannot be smaller than min! [Max: ${max}, Min: ${this.#min}]`))
        }
        this.#max = max
        this.updateViews()
    }

    canGenerateMore(amountRequired = 1) {
        if (typeof amountRequired === undefined) {
            throw new ControllerError(ControllerError.MESSAGES.undefinedValue.concat(`Parameter: amount`))
        }
        const wouldBeGeneratedCount = this.#availableNumbersCount() - amountRequired
        return wouldBeGeneratedCount <= range(this.#min, this.#max).length 
            && wouldBeGeneratedCount >= 0
    }

    async invokeSuerte(amountRequired) {
        if (typeof amountRequired === undefined) {
            throw new ControllerError(ControllerError.MESSAGES.undefinedValue.concat(`Invalid parameter: amount`))
        }
        if (amountRequired < 0) {
            throw new ControllerError(ControllerError.MESSAGES.negativeValue.concat(`[Amount: ${amountRequired}]`))
        }
        // TODO: Can be extended with the penalty option
        // `penalized` is a mock object to use in the future
        const penalized = [{ number: 1, value: 1 }]
        const suertables = range(this.#min, this.#max).map(number => {
            const suertable = new Suertable(number)
            if (penalized.map(p => p.number).includes(number)) {
                const penalty = penalized.find(p => p.number === number).value
                suertable.setPenalty(penalty)
            }
            return suertable
        })
        const suerted = new Suerte(this.#excludedNumbers, suertables).generate(amountRequired)
        this.#numbersRepository.save(suerted) 
        this.#excludedNumbers = this.#numbersRepository.load()
        const resultTable = new SuertedTable(); resultTable.clear()
        const loading = new SuerteLoading(); loading.draw()
        return waitForAudio(audios.randomItem()).then(() => {
            resultTable.setNumbers(suerted)
            loading.clear()
            resultTable.draw()
        })
    }

    onResetClick() {
        this.#numbersRepository.clear()
        this.#excludedNumbers = []
        this.updateViews()
    }

    initViews() {
        this.updateViews()
    }

    updateViews() {
        const onExcludeCheckChange = (number, state) => {
            if (state) {
                this.#excludedNumbers.push(number)
            } else {
                this.#excludedNumbers.removeItem(number)
            }
        }
        const numberCells = range(this.#min, this.#max)
            .map(n => new ExclusionTableCell(onExcludeCheckChange, n, this.#excludedNumbers.includes(n)))
        new ExclusionTable(numberCells).draw()
    }

    #availableNumbersCount() {
        return range(this.#min, this.#max).length - this.#excludedNumbers.length
    }
}

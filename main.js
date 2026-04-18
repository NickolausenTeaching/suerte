import { endingDelta, endingDurationMS, range, relativeURL } from "./scripts/lib/utils.js"
import { Generator } from "./scripts/core/generator.js"
import { DiscardTable, Cell } from "./scripts/ui/discardTable.js"

let lastTimeout = undefined
const generator = new Generator()
const discardTable = new DiscardTable(generator.getHistory())

const audios = [
    "public/sounds/far-west.mp3",
    "public/sounds/ghigliottina.mp3",
    "public/sounds/billionaire.mp3",
    "public/sounds/jaws.mp3",
    "public/sounds/vecna-tick.mp3"
]

function updateGenerateButtonState() {
    const generateBtn = document.getElementById("generateBtn")
    generateBtn.disabled = !generator.canGenerateMore()
}

function drawDiscardPanel(min, max) {
    const numberTablePlaceholder = document.getElementById("numberTable")
    numberTablePlaceholder.innerHTML = ""
    discardTable.update(min, max)
    const table = discardTable.draw(min, max)
    numberTablePlaceholder.append(...table)
    document.querySelectorAll(".numberItemCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const num = Number(e.target.dataset.number)
            const cell = discardTable.cells.find(c => c.number === num)
            if (e.target.checked) {
                cell.check()
            } else {
                cell.reset()
            }
        })
    })
}

function drawSuertedNumbers(suertedNumbers) {
    const suertedTable = document.getElementById("suertedNumbersTable")
    suertedTable.innerHTML = ""

    suertedNumbers.forEach(number => {
        const numContainer = document.createElement("li")
        numContainer.classList.add("p-3", "display-1", "scary", "text-center")
        numContainer.innerText = number
        suertedTable.appendChild(numContainer)

        const cell = discardTable.cells.find(c => c.number === number)
        if (cell) {
            cell.check()
        }
        const checkbox = document.querySelector(`.numberItemCheckbox[data-number="${number}"]`)
        if (checkbox) {
            checkbox.checked = true
        }
    })
}

function onAudioStart(audioDurationMS) {
    const amount = Number(document.getElementById("numberAmt").value)
    const generateBtn = document.getElementById("generateBtn")
    lastTimeout && clearTimeout(lastTimeout)
    lastTimeout = setTimeout(() => {
        generator.exclude(discardTable.cells
            .filter(cell => cell.isChecked())
            .map(cell => cell.number))
        const suertedNumbers = generator.generateRandoms(amount)
        hideSuertingLoading()
        drawSuertedNumbers(suertedNumbers)
        generateBtn.setAttribute("disabled", "false")
        updateGenerateButtonState()
    }, Math.ceil(audioDurationMS) - (endingDurationMS - endingDelta))
}

function onGenerateClick() {
    const minHolderValue = Number(document.getElementById("numberMin").value)
    const maxHolderValue = Number(document.getElementById("numberMax").value)
    const amount = Number(document.getElementById("numberAmt").value)
    const nonCheckeds = Array.of(...document.querySelectorAll(`.numberItemCheckbox[data-number]`).values())
        .filter(checkbox => !checkbox.checked).length

    if (amount >= nonCheckeds) {
        alert("La suerte non può generare così tanti numeri!")
        return
    }
    const generateBtn = document.getElementById("generateBtn")
    generateBtn.setAttribute("disabled", "true")
    generator.setMin(minHolderValue); generator.setMax(maxHolderValue);
    displaySuertingLoading()

    const audioPlayer = new Audio()
    audioPlayer.addEventListener('loadedmetadata', (e) => {
        onAudioStart(Number(e.target.duration) * 1000)
    })
    audioPlayer.src = audios.randomItem()
    audioPlayer.currentTime = 0
    audioPlayer.play()
}

function onResetClick() {
    let minHolder = document.getElementById("numberMin")
    let maxHolder = document.getElementById("numberMax")
    discardTable.reset(); generator.reset();
    drawDiscardPanel(Number(minHolder.value), Number(maxHolder.value))
    updateGenerateButtonState()
}

function displaySuertingLoading() {
    document.getElementById("suertingLoading").classList.remove("d-none")
}

function hideSuertingLoading() {
    document.getElementById("suertingLoading").classList.add("d-none")
}

function main() {
    let minHolder = document.getElementById("numberMin")
    let maxHolder = document.getElementById("numberMax")
    drawDiscardPanel(Number(minHolder.value), Number(maxHolder.value))
    updateGenerateButtonState()

    minHolder.addEventListener('change', (e) => {
        drawDiscardPanel(Number(e.target.value), Number(maxHolder.value))
    })
    maxHolder.addEventListener('change', (e) => {
        drawDiscardPanel(Number(minHolder.value), Number(e.target.value))
    })

    const generateBtn = document.getElementById("generateBtn")
    generateBtn.addEventListener('click', onGenerateClick)

    const resetBtn = document.getElementById("resetBtn")
    resetBtn.addEventListener('click', onResetClick)
}

document.addEventListener('DOMContentLoaded', main)
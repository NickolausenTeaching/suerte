import { endingDelta, endingDurationMS, range } from "./lib/utils.js"
import { Generator } from "./core/generator.js"
import { DiscardTable, Cell } from "./ui/discardTable.js"

let lastTimeout = undefined
const generator = new Generator()
const discardTable = new DiscardTable()

const audios = [
    "../public/sounds/far-west.mp3",
    "../public/sounds/ghigliottina.mp3",
    "../public/sounds/billionaire.mp3",
    "../public/sounds/tense.mp3",
    "../public/sounds/jaws.mp3"
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
    document.querySelectorAll(".numberItem").forEach(checkbox => {
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
        const numContainer = document.createElement("h3")
        numContainer.classList.add("col", "display-1", "scary", "text-center")
        numContainer.innerText = number
        suertedTable.appendChild(numContainer)
    
        const cell = discardTable.cells.find(c => c.number === number)
        if (cell) {
            cell.check()
        }
        const checkbox = document.querySelector(`.numberItem[data-number="${number}"]`)
        if (checkbox) {
            checkbox.checked = true
        }
    })
}

function onAudioStart(audioDuration) {
    lastTimeout && clearTimeout(lastTimeout)
    lastTimeout = setTimeout(() => {
        const max = document.getElementById("numberMax")
        const min = document.getElementById("numberMin")
        const amount = document.getElementById("numberAmt")
        generator.exclude(discardTable.cells
            .filter(cell => cell.isChecked())
            .map(cell => cell.number))
        const suertedNumbers = generator.generateRandoms(Number(amount.value))
        hideSuertingLoading()
        drawSuertedNumbers(suertedNumbers)
        updateGenerateButtonState()
    }, Math.ceil(audioDuration * 1000) - (endingDurationMS - endingDelta))
}

function onGenerateClick() {
    const minHolderValue = Number(document.getElementById("numberMin").value)
    const maxHolderValue = Number(document.getElementById("numberMax").value)
    generator.setMin(minHolderValue); generator.setMax(maxHolderValue);
    displaySuertingLoading()

    const audioPlayer = new Audio()
    audioPlayer.addEventListener('loadedmetadata', (e) => {
        onAudioStart(Number(e.target.duration))
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
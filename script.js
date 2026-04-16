const alreadyGenerated = []
const audios = [
    "assets/far-west.mp3",
    "assets/ghigliottina.mp3",
    "assets/billionaire.mp3",
    "assets/tense.mp3",
    "assets/jaws.mp3"
]
const endingDurationMS = 5000
const endingDelta = 500
let lastTimeout = undefined

Array.prototype.randomItem = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function generateRandom(min = 1, max = 30, excludedNumbers = []) {
    let generated
    do {
        generated = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(generated)
    } while (excludedNumbers.includes(generated) || alreadyGenerated.includes(generated));
    alreadyGenerated.push(generated)
    return generated
}

function generateRandoms(amount, min, max, excludedNumbers) {
    let generated = []
    if (alreadyGenerated.length === amount) {
        return generated
    }
    if (max - min <= amount) {
        Array.from({ length: (max - min) + 1 }).map(n => Number(n)).forEach(num => {
            if (!alreadyGenerated.includes(num)) {
                generated.push(num)
            }
        })
    } else {
        for (let i = 0; i < amount; i++) {
            generated.push(generateRandom(min, max, excludedNumbers))
        }
    }
    return generated
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function createNumberTable(min, max) {
    min = Number(min)
    max = Number(max)
    if (max < min) {
        alert(`Dai non scherzare, metti per il verso quei numeri [min: ${min}, max: ${max}]`)
        return
    }

    const numberTable = document.getElementById("numberTable")
    numberTable.innerHTML = ""
    for (let n = min; n <= max; n++) {
        const checkContainer = document.createElement("div")
        checkContainer.classList.add("col", "d-flex", "flex-row", "align-items-center", "justify-content-center")

        const checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox")
        if (alreadyGenerated.includes(n)) {
            checkbox.checked = true
        }
        checkbox.setAttribute("data-number", n)
        checkbox.classList.add("numberItem")

        const numberText = document.createElement("span")
        numberText.classList.add("scary", "fs-1", "d-inline-block", "ms-3")
        numberText.innerText = n.toString().padStart(2, "0")

        checkContainer.appendChild(checkbox)
        checkContainer.appendChild(numberText)
        numberTable.appendChild(checkContainer)
    }
}

function main() {
    const min = document.getElementById("numberMin")
    const max = document.getElementById("numberMax")
    createNumberTable(min.value, max.value)

    min.addEventListener('change', (e) => createNumberTable(e.target.value, max.value))
    max.addEventListener('change', (e) => createNumberTable(min.value, e.target.value))

    const audioPlayer = new Audio(audios.randomItem())
    const generateBtn = document.getElementById("generateBtn")
    const suertedTable = document.getElementById("suertedNumbersTable")
    generateBtn.addEventListener('click', () => {
        suertedTable.innerHTML = ""
        createNumberTable(min.value, max.value)
        audioPlayer.addEventListener('loadedmetadata', () => {
            clearTimeout(lastTimeout)
            lastTimeout = setTimeout(() => {
                const max = document.getElementById("numberMax")
                const min = document.getElementById("numberMin")
                const amount = document.getElementById("numberAmt")
                const discardNumbers = [...document.getElementsByClassName("numberItem")]
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => Number(checkbox.getAttribute("data-number")))
                const suertedNumbers = generateRandoms(Number(amount.value), Number(min.value), Number(max.value), discardNumbers)
                suertedNumbers.forEach(number => {
                    const numContainer = document.createElement("h3")
                    numContainer.classList.add("col", "display-1", "scary", "text-center")
                    numContainer.innerText = number
                    suertedTable.appendChild(numContainer)
                })
            }, Math.ceil(audioPlayer.duration * 1000) - (endingDurationMS - endingDelta))
        })
        audioPlayer.src = audios.randomItem()
        audioPlayer.currentTime = 0
        audioPlayer.play()
    })
}

document.addEventListener('DOMContentLoaded', main)
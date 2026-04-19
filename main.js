import { Controller } from "./scripts/controller/Controller.js"
import InBrowserNumbersRepository from "./scripts/controller/InBrowserNumbersRepository.js"

const app = (() => {
    let controller
    
    function toggleGenerate(state) {
        if (state) {
            enableGenerate()
        } else {
            disableGenerate()
        }
    }
        
    function enableGenerate() {
        document.getElementById("generateBtn").removeAttribute("disabled")
    }
        
    function disableGenerate() {
        document.getElementById("generateBtn").setAttribute("disabled", "")
    }
    
    function main() {
        const minHolder = document.getElementById("numberMin")
        const maxHolder = document.getElementById("numberMax")
        const amountHolder = document.getElementById("numberAmt")
    
        minHolder.value = Controller.DEFAULT_MIN
        maxHolder.value = Controller.DEFAULT_MAX
        amountHolder.value = Controller.DEFAULT_AMOUNT
    
        minHolder.setAttribute("placeholder", Controller.DEFAULT_MIN)
        maxHolder.setAttribute("placeholder", Controller.DEFAULT_MAX)
        amountHolder.setAttribute("placeholder", Controller.DEFAULT_AMOUNT)
        controller = new Controller(
            Number(minHolder.value), 
            Number(maxHolder.value), 
            new InBrowserNumbersRepository()
        )
        controller.initViews()
        toggleGenerate(controller.canGenerateMore(Number(amountHolder.value)))
        
        const generateBtn = document.getElementById("generateBtn")
        generateBtn.addEventListener('click', async () => {
            console.info("Trying to call the Suerte, please hold on...")
            try {
                disableGenerate()
                const amt = Number(document.getElementById("numberAmt").value)
                controller.invokeSuerte(amt)
                    .then((_) => {
                        toggleGenerate(controller.canGenerateMore(Number(amountHolder.value)))
                        controller.updateViews()
                        console.info("Alea iacta est.")
                    })
            } catch (e) {
                console.error("Cannot invoke Suerte — it is tired...")
                enableGenerate()
            }
        })
    
        const resetBtn = document.getElementById("resetBtn")
        resetBtn.addEventListener('click', () => {
            controller.onResetClick()
            enableGenerate()
            console.info("The state has been reset!")
        })
    
        minHolder.addEventListener('change', (e) => {
            try {
                controller.onMinInput(Number(e.target.value))
                toggleGenerate(controller.canGenerateMore(Number(amountHolder.value)))
            } catch (error) {
                disableGenerate()
                console.error(error) // Mr. Casadei will handle perfectly this error
            }
        })
    
        maxHolder.addEventListener('change', (e) => {
            try {
                controller.onMaxInput(Number(e.target.value))
                toggleGenerate(controller.canGenerateMore(Number(amountHolder.value)))
            } catch (error) {
                disableGenerate()
                console.error(error) // Mr. Casadei will handle perfectly this error
            }
        })
    
        amountHolder.addEventListener('change', (e) => {
            toggleGenerate(controller.canGenerateMore(Number(e.target.value)))
        })
    }

    function onCheckboxesChange() {
        const checkboxes = document.querySelectorAll("input[type='checkbox']")
        checkboxes.forEach(el => {
            el.addEventListener("change", () => {
                const amountHolder = document.getElementById("numberAmt")
                toggleGenerate(controller.canGenerateMore(Number(amountHolder.value)))
            })
        })
    }

    return { 
        init: main,
        updateCheckboxes: onCheckboxesChange  
    }
})()

document.addEventListener('DOMContentLoaded', app.init)
document.addEventListener('change', () => {
    app.updateCheckboxes()
})
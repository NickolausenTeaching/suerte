import ViewComponent from "./ViewComponent.js";

export default class SuerteLoading extends ViewComponent {
    draw() {
        document.getElementById("suertingLoading").classList.remove("d-none")
    }

    clear() {
        document.getElementById("suertingLoading").classList.add("d-none")
    }
}
export const endingDurationMS = 5000
export const endingDelta = 500

Array.prototype.randomItem = function () {
    return this[Math.floor(Math.random() * this.length)]
}

export const range = function (start, stop) {
    return Array.from({ length: Math.abs(stop - start) + 1 }, (_, i) => start + i)
}

export const relativeURL = (url) => window.location.hostname.concat(url)
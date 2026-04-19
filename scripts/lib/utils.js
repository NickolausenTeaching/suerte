export const endingDurationMS = 5000
export const endingDelta = 500
export const numberAppearingDelay = 250

Array.prototype.randomItem = function () {
    return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.removeItem = function (toRemove) {
    return this.filter(n => n !== toRemove)
}

export const range = function (start, stop) {
    return Array.from({ length: Math.abs(stop - start) + 1 }, (_, i) => start + i)
}

/**
 * 
 * @param {HTMLAudioElement} audioPlayer 
 */
const loadAudioMetadata = async function (audioPlayer) {
    return new Promise((resolve, reject) => {
        if (typeof audioPlayer === undefined) {
            reject("Cannot load metadata of undefined audio element!")
        }
        audioPlayer.addEventListener('loadedmetadata', (e) => resolve(e.target))
    })
}

let lastTimeout = null
/**
 * @param {string} audioSrc 
 */
export const waitForAudio = async function (audioSrc) {
    const audioPlayer = new Audio(audioSrc)
    return loadAudioMetadata(audioPlayer)
        .then((audio) => {
            audio.currentTime = 0
            audio.play()
            lastTimeout && clearTimeout(lastTimeout)
            return new Promise((resolve, reject) => {
                const timeoutMS = Math.ceil(audio.duration * 1000) - (endingDurationMS - endingDelta) 
                lastTimeout = setTimeout(() => resolve(), timeoutMS)
            })
        })
        .catch((reason) => console.error(`Something went wrong while trying to load audio '${audioSrc}': ${reason}`))
}
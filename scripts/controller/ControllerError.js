export default class ControllerError extends Error {
    static MESSAGES = {
        default: "An error has been thrown",
        invalidValue: "Invalid value received: ",
        negativeValue: "Value cannot be negative!",
        undefinedValue: "Value cannot be undefined!"
    }
    /**
     *
     */
    constructor(message) {
        super("Controller error: " + (message ?? ControllerError.MESSAGES.default));
    }
}
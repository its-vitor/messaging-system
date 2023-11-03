class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ImageTypeError extends CustomError {}
class ImageSizeError extends CustomError {}
class ContentLengthError extends CustomError {}

const Errors = {
    ImageTypeError,
    ImageSizeError,
    ContentLengthError,
};

export default Errors;
// @flow

export class DowncastError<T: Object> extends Error {
    value: T
    cls: Class<T>

    constructor(value: T, cls: Class<T>) {
        super(`Could not downcast a "${value.constructor.name}" to a "${cls.name}"`)
        this.value = value
        this.cls = cls
    }
}

export default function downcast<T, U>(cls: Class<U>, value: T): U {
    if (value instanceof cls) {
        return value
    }
    throw new DowncastError(value, cls)
}

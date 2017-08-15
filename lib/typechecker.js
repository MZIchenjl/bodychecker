import _ from 'lodash'

const ERROR = (name, message) => {
    const err = new Error(message)
    err.name = name
    return err
}

const chainableTypeChecker = (validate) => {
    const checkType = (isRequired, body, fieldname) => {
        if (_.isEmpty(body[fieldname])) {
            if (isRequired) {
                return false
            } else {
                return true
            }
        } else {
            return validate(body, fieldname)
        }
    }
    const chainedCheckType = checkType.bind(undefined, false)
    chainedCheckType.isRequired = checkType.bind(undefined, true)
    return chainedCheckType
}

const anyChecker = () => {
    const validate = (body, fieldname) => {
        return true
    }
    return chainableTypeChecker(validate)
}

const arrayChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isArray(fieldvalue)) {
            return true
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const boolChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isBoolean(fieldvalue)) {
            return true
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const numberChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isNumber(fieldvalue)) {
            return true
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const objectChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isObject(fieldvalue)) {
            return true
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const stringChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isString(fieldvalue)) {
            return true
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const oneOfChecker = (arr) => {
    if (!_.isArray(arr)) {
        throw Error('ArgumentError', 'Invalid Type of argument of oneOf, `array` expected.')
    }
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.includes(arr, fieldvalue)) {
            return true
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const oneOfTypeChecker = (arr) => {
    if (!_.isArray(arr)) {
        throw Error('ArgumentError', 'Invalid Type of argument of oneOfType, `array` expected.')
    }
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        for (let checker of arr) {
            if (!_.isFunction(checker)) {
                throw Error('ArgumentError', 'Invalid Type of argument in oneOfType, `function` expected.')
            }
        }
        return false
    }
    return chainableTypeChecker(validate)
}

const arrayOfChecker = (checker) => {
    if (!_.isFunction(checker)) {
        throw Error('ArgumentError', 'Invalid Type of argument in arrayOf, `function` expected.')
    }
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (!_.isArray(fieldvalue)) {
            return false
        }
        for (let i = 0, len = fieldvalue.length; i < len; i++) {
            if (!checker(fieldvalue, i)) {
                return false
            }
        }
        return true
    }
    return chainableTypeChecker(validate)
}

const objectOfChecker = (checker) => {
    if (!_.isFunction(checker)) {
        throw Error('ArgumentError', 'Invalid Type of argument in objectOf, `function` expected.')
    }
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (!_.isObject(fieldvalue)) {
            return false
        }
        for (let key in fieldvalue) {
            if (!checker(fieldvalue, key)) {
                return false
            }
        }
        return true
    }
    return chainableTypeChecker(validate)
}

const shapeOfChecker = (shape) => {
    if (!_.isObject(shape)) {
        throw Error('ArgumentError', 'Invalid Type of argument in shapeOf, `object` expected.')
    }
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (!_.isObject(fieldvalue)) {
            return false
        }
        for (let ckey in shape) {
            const checker = shape[ckey]
            if (!_.isFunction(checker)) {
                throw Error('ArgumentError', 'Invalid Type of argument in shapeOf, `function` expected.')
            }
            if (!checker(fieldvalue, ckey)) {
                return false
            }
        }
        return true
    }
    return chainableTypeChecker(validate)
}

module.exports = {
    any: anyChecker(),
    array: arrayChecker(),
    object: objectChecker(),
    bool: boolChecker(),
    number: numberChecker(),
    string: stringChecker(),
    oneof: oneOfChecker,
    oneoftype: oneOfTypeChecker,
    arrayof: arrayOfChecker,
    objectof: objectOfChecker,
    shapeof: shapeOfChecker
}
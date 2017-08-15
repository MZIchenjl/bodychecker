import _ from 'lodash'

const ERROR = (name, message) => {
    const err = new Error(message)
    err.name = name
    return err
}

const chainableTypeChecker = (validate) => {
    const checkType = (isRequired, body, fieldname) => {
        if (typeof body[fieldname] === 'undefined') {
            if (isRequired) {
                return `Field ${fieldname} is empty!`
            } else {
                return null
            }
        } else {
            return validate(body, fieldname)
        }
    }
    const chainedCheckType = checkType.bind(null, false)
    chainedCheckType.isRequired = checkType.bind(null, true)
    return chainedCheckType
}

const anyChecker = () => {
    const validate = (body, fieldname) => {
        return null
    }
    return chainableTypeChecker(validate)
}

const arrayChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isArray(fieldvalue)) {
            return null
        }
        return `Field ${fieldname}:${fieldvalue} is invalid, array expected!`
    }
    return chainableTypeChecker(validate)
}

const boolChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isBoolean(fieldvalue)) {
            return null
        }
        return `Field ${fieldname}:${fieldvalue} is invalid, boolean expected!`
    }
    return chainableTypeChecker(validate)
}

const numberChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isNumber(fieldvalue)) {
            return null
        }
        return `Field ${fieldname}:${fieldvalue} is invalid, number expected!`
    }
    return chainableTypeChecker(validate)
}

const objectChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isObject(fieldvalue)) {
            return null
        }
        return `Field ${fieldname}:${fieldvalue} is invalid, object expected!`
    }
    return chainableTypeChecker(validate)
}

const stringChecker = () => {
    const validate = (body, fieldname) => {
        const fieldvalue = body[fieldname]
        if (_.isString(fieldvalue)) {
            return null
        }
        return `Field ${fieldname}:${fieldvalue} is invalid, string expected!`
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
            return null
        }
        return `Field ${fieldname}:${fieldvalue} is invalid, oneof(${arr.toString()}) expected!`
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
            if (checker(body, fieldname)) {
                return null
            }
        }
        return `Field ${fieldname}:${fieldvalue} is invalid!`
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
            return `Field ${fieldname}:${fieldvalue} is invalid, array expected!`
        }
        for (let i = 0, len = fieldvalue.length; i < len; i++) {
            const result = checker(fieldvalue, i)
            if (!_.isNull(result)) {
                return result
            }
        }
        return null
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
            return `Field ${fieldname}:${fieldvalue} is invalid, object expected!`
        }
        for (let key in fieldvalue) {
            const result = checker(fieldvalue, key)
            if (!_.isNull(result)) {
                return result
            }
        }
        return null
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
            return `Field ${fieldname}:${fieldvalue} is invalid, object expected!`
        }
        for (let ckey in shape) {
            const checker = shape[ckey]
            if (!_.isFunction(checker)) {
                throw Error('ArgumentError', 'Invalid Type of argument in shapeOf, `function` expected.')
            }
            const result = checker(fieldvalue, ckey)
            if (!_.isNull(result)) {
                return result
            }
        }
        return null
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
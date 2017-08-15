import _ from 'lodash'
import FieldTypes from './lib/typechecker'

const ERROR = (name, message) => {
    const err = new Error(message)
    err.name = name
    return err
}

const defaultCallback = (req, res, next, fieldname, result) => {
    req.status(400)
    return res.json({
        code: 400,
        message: `Invalid type in the body, field ${fieldname}, result ${result}.`
    })
}

const bodychecker = (failedCallback, fieldOption) => {
    if (!fieldOption || !_.isObject(fieldOption)) {
        throw ERROR('OptionError', 'Invalid type of option, `object` expected!')
    }
    for (let fieldname in fieldOption) {
        const checker = fieldOption[fieldname]
        if (!checker || !_.isFunction(checker)) {
            throw ERROR('CheckerError', 'Invalid type of checker, `function` expected!')
        }
    }
    return (req, res, next) => {
        const body = req.body
        for (let fieldname in fieldOption) {
            const checker = fieldOption[fieldname]
            const result = !checker(body, fieldname)
            if (!_.isNull(result)) {
                return failedCallback(req, res, next, fieldname, result)
            }
        }
        next()
    }
}

const expo = bodychecker.bind(null, defaultCallback)
expo.FieldTypes = FieldTypes
expo.failed = (cb) => bodychecker.bind(null, cb)

module.exports = expo
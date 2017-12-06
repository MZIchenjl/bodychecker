const _ = require('lodash'),
  fieldTypes = require('./lib/typechecker')

const bodyChecker = function (fieldTypeCheckers) {
  return (req, res, next) => {
    let result = null
    req.$bcResult = null
    if (!_.isObject(req.body)) {
      const err = new Error('The req.body must be an Object!')
      err.name = 'BodyError'
      return next && next(err)
    }
    for (let fieldName in fieldTypeCheckers) {
      const checker = fieldTypeCheckers[fieldName]
      if (!_.isFunction(checker)) {
        const err = new Error(`The checker for field \`${fieldName}\` is not a function!`)
        err.name = 'CheckerError'
        return next && next(err)
      }
      try {
        result = checker(req.body, fieldName)
      } catch (err) {
        return next && next(err)
      }
      if (result) {
        req.$bcResult = result
        break
      }
    }
    return next && next()
  }
}

bodyChecker.any = fieldTypes.any
bodyChecker.array = fieldTypes.array
bodyChecker.object = fieldTypes.object
bodyChecker.bool = fieldTypes.boo
bodyChecker.number = fieldTypes.number
bodyChecker.string = fieldTypes.string
bodyChecker.oneof = fieldTypes.oneof
bodyChecker.oneoftype = fieldTypes.oneoftype
bodyChecker.arrayof = fieldTypes.arrayof
bodyChecker.objectof = fieldTypes.objectof
bodyChecker.shapeof = fieldTypes.shapeof

module.exports = bodyChecker

const _ = require('lodash')

const chainableTypeChecker = (validate) => {
  const checkType = (isRequired, body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.isUndefined(fieldvalue)) {
      if (isRequired) {
        return {
          message: `Field path: \`${fieldpath}\` is required, but empty!`,
          type: 'empty',
          fieldpath: fieldpath,
          fieldvalue: fieldvalue
        }
      } else {
        return null
      }
    } else {
      return validate(body, fieldpath)
    }
  }
  const chainedCheckType = checkType.bind(null, false)
  chainedCheckType.isRequired = checkType.bind(null, true)
  return chainedCheckType
}

const anyChecker = () => {
  const validate = (body, fieldpath) => {
    return null
  }
  return chainableTypeChecker(validate)
}

const arrayChecker = () => {
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.isArray(fieldvalue)) {
      return null
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "array" expected!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const boolChecker = () => {
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.isBoolean(fieldvalue)) {
      return null
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "boolean" expected!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const numberChecker = () => {
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.isNumber(fieldvalue)) {
      return null
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "number" expected!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const objectChecker = () => {
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.isObject(fieldvalue)) {
      return null
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "object" expected!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const stringChecker = () => {
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.isString(fieldvalue)) {
      return null
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "string" expected!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const oneOfChecker = (arr) => {
  if (!_.isArray(arr)) {
    const err = new Error('Invalid argument type of "oneof", an Array required!')
    err.name = 'ArgumentError'
    throw err
  }
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (_.includes(arr, fieldvalue)) {
      return null
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, can't find the value in the "oneof" array!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const oneOfTypeChecker = (arr) => {
  if (!_.isArray(arr)) {
    const err = new Error('Invalid argument type of "oneoftype", an Array required!')
    err.name = 'ArgumentError'
    throw err
  }
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    for (let checker of arr) {
      if (!_.isFunction(checker)) {
        const err = new Error('Invalid checker function in "oneoftype"!')
        err.name = 'CheckerError'
        throw err
      }
      if (_.isNull(checker(body, fieldpath))) {
        return null
      }
    }
    return {
      message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, the value can't pass any checker in the "oneoftype" array!`,
      type: 'invalid',
      fieldpath: fieldpath,
      fieldvalue: fieldvalue
    }
  }
  return chainableTypeChecker(validate)
}

const arrayOfChecker = (checker) => {
  if (!_.isFunction(checker)) {
    const err = new Error('Invalid checker function of "arrayof"!')
    err.name = 'CheckerError'
    throw err
  }
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (!_.isArray(fieldvalue)) {
      return {
        message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "array" expected!`,
        type: 'invalid',
        fieldpath: fieldpath,
        fieldvalue: fieldvalue
      }
    }
    for (let i = 0, len = fieldvalue.length; i < len; i++) {
      try {
        const result = checker(body, `${fieldpath}[${i}]`)
        if (!_.isNull(result)) {
          return result
        }
      } catch (err) {
        throw err
      }
    }
    return null
  }
  return chainableTypeChecker(validate)
}

const objectOfChecker = (checker) => {
  if (!_.isFunction(checker)) {
    const err = new Error('Invalid checker function of "objectof"!')
    err.name = 'CheckerError'
    throw err
  }
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (!_.isObject(fieldvalue)) {
      return {
        message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "object" expected!`,
        type: 'invalid',
        fieldpath: fieldpath,
        fieldvalue: fieldvalue
      }
    }
    for (let key in fieldvalue) {
      const result = checker(body, `${fieldpath}.${key}`)
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
    const err = new Error('Invalid argument type of "shapeof", an Object required!')
    err.name = 'ArgumentError'
    throw err
  }
  const validate = (body, fieldpath) => {
    const fieldvalue = _.get(body, fieldpath)
    if (!_.isObject(fieldvalue)) {
      return {
        message: `Field path: \`${fieldpath}\`, value: ${JSON.stringify(fieldvalue)} is invalid, type "object" expected!`,
        type: 'invalid',
        fieldpath: fieldpath,
        fieldvalue: fieldvalue
      }
    }
    for (let ckey in shape) {
      const checker = shape[ckey]
      if (!_.isFunction(checker)) {
        const err = new Error('Invalid checker function in "shapeof"!')
        err.name = 'CheckerError'
        throw err
      }
      const result = checker(body, `${fieldpath}.${ckey}`)
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

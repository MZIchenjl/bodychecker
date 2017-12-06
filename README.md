# Bodychecker

Bodychecker is a express middleware for handling `req.body`, which is used to validate the value in the body like the React Proptypes way.

# Installation

```npm install --save bodychecker```

# Usage 

Bodychecker add result "`req.$bcResult`" to the express RequestHandler. 

example:

```javascript
var express = require('express')
var bodychecker  = require('bodychecker')

var app = express()

app.post('/post/new', bodychecker({
  title: bodychecker.string.isRequired,
  author: bodychecker.string,
  time: bodychecker.number,
  content: bodychecker.string.isRequired
}), function (req, res, next) {
  // req.$bcResult is the result of the bodycheck, which will be null if all the fields are valid
  // place your awesome code
})
```

# API

All supported types:

* `any`(_optional_`isRequired`) any type, e.g `'abc',123,undefind`

* `array`(_optional_`isRequired`) array type, e.g `[1,2,3...]`

* `object`(_optional_`isRequired`) object type, e.g `{a:1}`

* `bool`(_optional_`isRequired`) boolean type, e.g `true, false`

* `number`(_optional_`isRequired`) number type, e.g `3.14159265`

* `string`(_optional_`isRequired`) string type, e.g `Hello world!`

* `oneof`(_optional_`isRequired`) `array` argument required, e.g `oneof(['a', 'b'])`

* `oneoftype`(_optional_`isRequired`) `array` of `function` argument required, e.g `oneoftype([bodychecker.string,bodychecker.number])`

* `arrayof`(_optional_`isRequired`) `function` argument required, e.g `arrayof(bodychecker.string)`

* `objectof`(_optional_`isRequired`) `function` argument required, e.g `objectof(bodychecker.string)`

* `shapeof`(_optional_`isRequired`) `obeject` of  `function` argument required, e.g `shapeof({ title: bodychecker.string })`

__Custom checker__

Otherwise, You can also add custom checker.

```javascript
/**
 * customChecker
 * @param {object} - the req.body object
 * @param {string} fieldname - the field name
 * @return {object|null} result - the result
 */
function customChecker(body, fieldname) {
    // make sure this function can return with result or null
}
```

# LICENSE

MIT

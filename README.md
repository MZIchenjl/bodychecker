# Bodychecker

> A middleware for express.js to check the request body like the way of recat `PropTypes`.

## Usage

### Creat a new body checker

```js
var bodychecker = require('bodychecker');

// custom failed callback
var _bc = require('bodychecker');
var bodychecker = _bc.failed(function(req, res, next, fieldname, result) {
    /* your code here */
}));
```


### Suppported types

```js
var FieldTypes = require('bodychecker').FieldTypes;
```

* `any`(_optional_`isRequired`) any type, e.g `'abc',123,undefind`
* `array`(_optional_`isRequired`) array type, e.g `[1,2,3...]`
* `object`(_optional_`isRequired`) object type, e.g `{a:1}`
* `bool`(_optional_`isRequired`) boolean type, e.g `true, false`
* `number`(_optional_`isRequired`) number type, e.g `3.14159265`
* `string`(_optional_`isRequired`) string type, e.g `Hello world!`
* `oneof`(_optional_`isRequired`) `array` argument required, e.g `oneof(['a', 'b'])`
* `oneoftype`(_optional_`isRequired`) `object` of `function` argument required, e.g `oneoftype({FieldTypes.string})`
* `arrayof`(_optional_`isRequired`) `function` argument required, e.g `arrayof(FieldTypes.string)`
* `objectof`(_optional_`isRequired`) `function` argument required, e.g `objectof(FieldTypes.string)`
* `shapeof`(_optional_`isRequired`) `obeject` of  `function` argument required, e.g `shapeof({ title: FieldTypes.string })`

## Example Usage

```js
var _bc = require('bodychecker');
var FieldTypes = require('bodychecker').FieldTypes;

var bodychecker = _bc.failed(function(req, res, next, fieldname, result) {
    return res.json({
        code: 400,
        message: 'Invalid type in the body, field ' + fieldname + ', result ' + result + '.';
    })
});

router.post('/post/new', bodychecker({
    title: FieldTypes.string.isRequired,
    type: FieldTypes.oneof(['normal', 'vote']).isRequired,
    category: FieldTypes.string.isRequired,
    content: FieldTypes.string.isRequired,
    user: FieldTypes.shapeof({
        user: FieldTypes.string,
        email: FieldTypes.string
    })
}), function(req, res, next) {
    /* other code */
})
```

var http = require('http')
var express = require('express')
var bodyparser = require('body-parser')
var bodychecker = require('../index')

var app = express()

app.use(bodyparser.json())

var responseHandler = function (req, res, next) {
  console.info(`${req.method} - ${req.path}`)
  if (req.$bcResult) {
    console.log(`req.$bcResult = ${JSON.stringify(req.$bcResult)}`)
    return res.status(401).json(req.$bcResult)
  }
  res.status(200).send('OK!')
}

// user login
app.post('/user/login', bodychecker({
  username: bodychecker.string.isRequired,
  password: bodychecker.string.isRequired
}), responseHandler)

// user edit
app.post('/user/edit', bodychecker({
  username: bodychecker.string.isRequired,
  password: bodychecker.string.isRequired,
  friend_ids: bodychecker.arrayof(bodychecker.string.isRequired),
  profile: bodychecker.shapeof({
    nickname: bodychecker.string,
    gender: bodychecker.oneof([
      'male',
      'femamle'
    ]),
    age: bodychecker.number
  })
}), responseHandler)

var server = http.createServer(app)

module.exports = server

server.listen(3000, () => {
  console.log('Test Server Listening on port 3000.')
})

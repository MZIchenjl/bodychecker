const http = require('http'),
  express = require('express'),
  bodyparser = require('body-parser'),
  bodychecker = require('../index')

// express app with simple methods
const app = express()

app.use(bodyparser.json())

const responseHandler = (req, res, next) => {
  console.info(`${req.method} - ${req.path}`)
  if (req.$bcResult) {
    console.log(`req.$bcResult = ${JSON.stringify(req.$bcResult)}`)
    return res.status(401).json(req.$bcResult)
  }
  res.status(200).send('OK!')
}

app.post('/user/login', bodychecker({
  username: bodychecker.string.isRequired,
  password: bodychecker.string.isRequired
}), responseHandler)

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

const server = http.createServer(app)

module.exports = server

server.listen(3000, () => {
  console.log('Test Server Listening on port 3000.')
})

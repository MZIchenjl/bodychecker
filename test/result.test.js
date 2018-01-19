const server = require('./server'),
  bodychecker = require('../index'),
  supertest = require('supertest'),
  should = require('should'),
  assert = require('assert')

const client = supertest(server)

describe('Test Bodychecker Results', () => {
  it('Valid POST data on /user/login', (done) => {
    client.post('/user/login').send({
      username: 'mzi',
      password: 'happyhappycode'
    })
      .expect(200, 'OK!', done)
  })

  it('Invalid POST data on /user/login', (done) => {
    client.post('/user/login').send({
      username: 'mzi',
      password: 123456
    })
      .expect('Content-Type', /json/)
      .expect(401, {
        message: 'Field path: `password`, value: 123456 is invalid, type "string" expected!',
        type: 'invalid',
        fieldpath: 'password',
        fieldvalue: 123456
      }, done)
  })

  it('Valid POST data on /user/edit', (done) => {
    client.post('/user/edit').send({
      username: 'mzi',
      password: 'happyhappycode',
      friend_ids: ['1000', '1001', '1002'],
      profile: {
        nickname: 'mzi',
        gender: 'male',
        age: 24
      }
    })
      .expect(200, 'OK!', done)
  })

  it('Invalid POST data in arrayof on /user/edit', (done) => {
    client.post('/user/edit').send({
      username: 'mzi',
      password: 'happyhappycode',
      friend_ids: [1000, '1001', '1002'],
      profile: {
        nickname: 'mzi',
        gender: 'male',
        age: 24
      }
    })
      .expect(401, {
        "message": "Field path: `friend_ids[0]`, value: 1000 is invalid, type \"string\" expected!",
        "type": "invalid",
        "fieldpath": "friend_ids[0]",
        "fieldvalue": 1000
      }, done)
  })

  it('Invalid POST data in shapeof on /user/edit', (done) => {
    client.post('/user/edit').send({
      username: 'mzi',
      password: 'happyhappycode',
      friend_ids: ['1000', '1001', '1002'],
      profile: {
        nickname: 'mzi',
        gender: 'man',
        age: 24
      }
    })
      .expect(401, {
        "message": "Field path: `profile.gender`, value: \"man\" is invalid, can't find the value in the \"oneof\" array!",
        "type": "invalid",
        "fieldpath": "profile.gender",
        "fieldvalue": "man"
      }, done)
  })

  afterEach(() => {
    // server close
    server.close()
  })
})

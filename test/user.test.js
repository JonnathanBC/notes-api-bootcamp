const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')

// describe.only('creating a new user', () => {
describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'miduroot', passwordHash })
    await user.save()
  })

  test('works as expected creating a fresh username ', async () => {
    const usersDB = await User.find({})
    const usersAtStart = usersDB.map(user => user.toJSON())

    const newUser = {
      username: 'midudev',
      name: 'Miguel',
      password: 'tw1tch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersDBAfter = await User.find({})
    const usersAtEnd = usersDBAfter.map(user => user.toJSON())

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is alredy taken', async () => {
    const usersDB = await User.find({})
    const usersAtStart = usersDB.map(user => user.toJSON())

    const newUser = {
      username: 'miduroot',
      name: 'Miguel',
      password: 'midutest'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('Error, expected `username` to be unique. Value: `miduroot`')

    const usersDBEnd = await User.find({})
    const usersAtEnd = usersDBEnd.map(user => user.toJSON())
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})

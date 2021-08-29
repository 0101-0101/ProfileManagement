// const sum = require('./sum')
// const { registerController } = require('./controllers/auth.controller')

// test('add 1+2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3)
// })

// test('there is no I in team', () => {
//   expect('team').not.toMatch(/I/)
// })

// test('but there is a "stop" in Christoph', () => {
//   expect('Christoph').toMatch(/stop/)
// })

// test('Return Token', async () => {
//   const data = await registerController(req = {
//     body: {
//       name: 'Code',
//       email: 'code0120@gmail.com',
//       password: '123qwe'
//     }
//   })
//   expect(data).toBeTruth()
// })

const request = require('supertest')

// const { getDB } = require('./database.js')
// const db = getDB()

const app = require('./server')
// const User = db.collection('User')

// const { db,client } = require('./db/database')

// afterAll(done => {
//   // Closing the DB connection allows Jest to exit successfully.
//   client.close()
//   db.close()
//   done()
// })

// jest.setTimeout(50000)

test('Should signup a new user', async () => {
  const response = await request(app).post('/register')
    .send({ name: 'Test', email: 'test@test.com', password: '123qwe' })
    .expect(200)
    // console.log(response.body)
})

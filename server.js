const express = require('express')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions))

const { connectDB } = require('./database.js')
connectDB()

const userRouter = require('./routes/user.route')

app.use('/', userRouter)

app.listen(process.env.PORT, function () {
  console.log('listening on 3000')
})

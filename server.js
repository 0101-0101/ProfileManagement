const express = require('express');
const app = express();
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const cors = require('cors')
// app.use(cors());

const {connectDB} = require('./database.js')
connectDB()


const userRouter = require('./routes/user.route')

app.use('/',userRouter)


app.listen(3000, function() {
    console.log('listening on 3000')
  })
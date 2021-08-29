// const { MongoClient } = require('mongodb')

// let _db

// const connectDB = async () => {
//   await MongoClient.connect(process.env.MONGO_URI, (err, db) => {
//     if (err) {
//       console.log('DB Connection Error')
//     }
//     _db = db.db('gRPC')
//     console.log('Connected successfully to Mongo server')
//   })
// }

// const getDB = () => _db

// module.exports = { connectDB, getDB }

const MongoClient = require('mongodb').MongoClient
// const { dbUrl, dbName } = require("../config");

const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true })

const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      client.connect()
      const db = client.db('gRPC')
      resolve({ db, client })
    } catch (e) {
      console.log('error connecting to database', e)
      reject(new Error('Error connecting to database'))
    }
  })
}

module.exports = connect

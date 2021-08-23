const { MongoClient } = require('mongodb')

let _db

const connectDB = async () => {
  await MongoClient.connect(process.env.MONGO_URI, (err, db) => {
    if (err) {
      console.log('DB Connection Error')
    }
    _db = db.db('gRPC')
    console.log('Connected successfully to Mongo server')
  })
}

const getDB = () => _db

module.exports = { connectDB, getDB }

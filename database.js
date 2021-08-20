const { MongoClient } = require('mongodb')

let _db

const connectDB = async () => {
    try {
        await MongoClient.connect(process.env.MONGO_URI, (err, db) => {
            _db = db.db('gRPC')
            console.log('Connected successfully to Mongo server')

        })
    } catch (e) {
        throw e
    }
}

const getDB = () => _db

module.exports = { connectDB, getDB }
const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// Conexion a mongodb.
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database is conected')
  }).catch(error => {
    console.error(error)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})

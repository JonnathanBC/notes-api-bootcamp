require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

Sentry.init({
  dsn: 'https://9075f7ebde1a40f2815dd88146c7fc43@o1247862.ingest.sentry.io/6437573',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

// Ruta inicail de entrada (HOME)
app.get('/', (request, response) => {
  response.send('<h1>Hello world!!!</h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

// Entrara en este middleware siempre y cuando estemos pasando los errores en el next() conargumento error next(error)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }

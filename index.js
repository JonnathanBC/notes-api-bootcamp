require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')

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

app.get('/', (request, response) => {
  response.send('<h1>Hello world!!!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) return response.json(note)
    response.status(404).end()
  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  // Esto es porque porque a mongoDB le debemos de pasar un objeto con los valores originales antes de modoficar
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  // con el new: true le estamos diciendo que me devuelva el nuevo valor modificado sino me devuelve el que encontro por id
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note.content) {
    response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  // const ids = notes.map(note => note.id)
  // const maxId = Math.max(...ids)

  // Creamos la nota en base(instancia) al modelo
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  // Añadimos la nueva con el save() de mongoose
  newNote.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

// Entrara en este middleware siempre y cuando estemos pasando los errores en el next() conargumento error next(error)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`)
})

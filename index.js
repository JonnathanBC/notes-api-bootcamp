const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

app.use(express.json())
app.use(cors())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Nota 1',
    important: true,
    date: '2020-05-23T10:08:00.1992'
  },
  {
    id: 2,
    content: 'Nota 2',
    important: false,
    date: '2020-05-23T10:08:00.1992'
  },
  {
    id: 3,
    content: 'Nota 3',
    important: true,
    date: '2020-05-23T10:08:00.1992'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world!!!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  // Añadimos la nueva nota al array de notas
  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`)
})

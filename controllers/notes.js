const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
  /* Con promesas
    Note.find({}).then(notes => {
      response.json(notes)
    })
    */
  // Asyncrono
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) return response.json(note)
    response.status(404).end()
  }).catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
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

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndDelete(id)
  response.status(204).end()

  // Note.findByIdAndDelete(id)
  //  .then(() => response.status(204).end())
  //  .catch(error => next(error))
})

notesRouter.post('/', async (request, response, next) => {
  const note = request.body

  if (!note.content) {
    response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  // Creamos la nota en base(instancia) al modelo
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  // Añadimos la nueva con el save() de mongoose
  // newNote.save().then(savedNote => {
  //   response.json(savedNote)
  // }).catch(err => next(err))

  try {
    const savedNotes = await newNote.save()
    response.json(savedNotes)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter

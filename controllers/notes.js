const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middlewares/userExtractor')

notesRouter.get('/', async (request, response) => {
  /* Con promesas
    Note.find({}).then(notes => {
      response.json(notes)
    })
    */
  // Asyncrono
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) return response.json(note)
    response.status(404).end()
  }).catch(error => next(error))
})

notesRouter.put('/:id', userExtractor, (request, response, next) => {
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

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndDelete(id)
  response.status(204).end()

  // Note.findByIdAndDelete(id)
  //  .then(() => response.status(204).end())
  //  .catch(error => next(error))
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
  const { content, important = false } = request.body

  // get the userId from the token, saved in the middleware
  const { userId } = request
  const user = await User.findById(userId)

  if (!content) {
    response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  // Creamos la nota en base(instancia) al modelo
  const newNote = new Note({
    content: content,
    date: new Date(),
    important,
    user: user._id
  })

  // Añadimos la nueva con el save() de mongoose
  // newNote.save().then(savedNote => {
  //   response.json(savedNote)
  // }).catch(err => next(err))

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter

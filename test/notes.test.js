const mongoose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const { api, getAllContentFromNotes, initialNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  /* Lo hace en paralelo, osea de forma random no sigue un orden, no tenemos un control de cual se guarda antes que otro
  const notesObject = initialNotes.map(note => new Note(note))
  const promises = notesObject.map(note => note.save())
  await Promise.all(promises)
  */

  // Lo hace en forma secuencial osea uno despues de otro en secuencia, xq espera uno a uno la ejecucion.
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first notes is about midudev', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('Aprendiendo FullStack JS con midudev')
  })
})

describe('Create a note', () => {
  test('is posible with a valid note', async () => {
    const newNote = {
      content: 'Coming soon async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not posible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

test('a note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: note } = firstResponse
  const [noteToDelete] = note

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentFromNotes()

  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

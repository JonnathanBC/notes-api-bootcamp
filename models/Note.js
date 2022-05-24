const { model, Schema } = require('mongoose')

// creacion del schema
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// creacion modelo
const Note = model('Note', noteSchema)

module.exports = Note

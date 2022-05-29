const { model, Schema } = require('mongoose')

// creacion del schema
const userSchema = new Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

// creacion modelo
const User = model('User', userSchema)

module.exports = User

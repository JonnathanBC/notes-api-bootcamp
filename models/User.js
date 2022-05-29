const uniqueValidator = require('mongoose-unique-validator')
const { model, Schema } = require('mongoose')

// creacion del schema
const userSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
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

userSchema.plugin(uniqueValidator)

// creacion modelo
const User = model('User', userSchema)

module.exports = User

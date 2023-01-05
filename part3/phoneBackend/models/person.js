const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// esquema definido a nivel de aplicacion por Mongoose, el cual definira la forma de los documentos almacenados en una coleccion determinada
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
  },
})
personSchema.plugin(uniqueValidator)

// Una forma de formatear los objetos devueltos por Mongoose es modificar el método toJSON del esquema,
// que se utiliza en todas las instancias de los modelos producidos con ese esquema.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// La interfaz pública del módulo se define estableciendo un valor en la variable module.exports.
// Estableceremos el valor para que sea el modelo Note.
module.exports = mongoose.model('Person', personSchema)

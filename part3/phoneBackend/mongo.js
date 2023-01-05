const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://carlos99:${password}@cluster0.lni3jxx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const _name = process.argv[3]
const _number = process.argv[4]

mongoose.connect(url)

// esquema definido a nivel de aplicacion por Mongoose, el cual definira la forma de los documentos almacenados en una coleccion determinada
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// modelo
const Person = mongoose.model('Person', personSchema)

// objeto a partir del modelo
const person = new Person({
  name: _name,
  number: _number,
})

if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${_name} number ${_number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

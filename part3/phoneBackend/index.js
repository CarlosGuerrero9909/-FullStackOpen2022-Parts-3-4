/* ------------------------- Cabecera --------------------------------------*/
const express = require('express')

const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

// Middleware de nivel de solicitud HTTP permite registrar las solicitudes junto con alguna otra información dependiendo de su configuración
morgan.token('body', (request) => JSON.stringify(request.body)) // nuestro propido token 'body' que retorna el body de la peticion en formato json

app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
) // usa dicha configuracion de manera global para todas las peticiones
app.use(cors())
app.use(express.static('build')) // busca y devuelve los archivos estáticos solicitados por el usuario y recibe como parámetro la ruta del folder donde están esos archivos.

/* ------------------- Rutas (peticiones)  Endpoints --------------------*/

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post(
  '/api/persons',
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
  (request, response, next) => {
    const { body } = request

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then((savedPerson) => savedPerson.toJSON())
      .then((savedAndFormattedPerson) => {
        response.json(savedAndFormattedPerson)
      })
      .catch((error) => next(error))
  },
)

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true }) // Agregamos el parámetro opcional { new: true }, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original.
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  response.send(`
		Phonebook has info for ${Person.estimatedDocumentCount()} people <br></br>
		${new Date()}
	`)
})

/* ------------------------------ El orden de carga de los middleware-----------------------------------------------------*/

// midleware despues de rutas (endpoint desconocido) peticiones a rutas inexistentes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) // handler of requests with unknown endpoint

// middleware manejador de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error) // middleware pasa el error al controlador de errores Express predeterminado.
}
app.use(errorHandler) // handler of requests with result to errors

/* -------------------- Puerto ------------------------------*/
const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

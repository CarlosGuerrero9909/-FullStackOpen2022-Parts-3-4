// La responsabilidad de establecer la conexión con la base de datos se ha entregado al módulo app.js. el orden de los app.use es importante
const express = require('express')
const config = require('./utils/config')
// La 'magia' de la biblioteca nos permite eliminar por completo los bloques try-catch y la llamada next(exception) Si ocurre una excepción en una ruta async, la ejecución se pasa automáticamente al middleware de manejo de errores
require('express-async-errors')

const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')// El archivo app.js que crea la aplicación real , toma el enrutador
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// app.use(middleware.userExtractor)

// use the middleware only in /api/blogs routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter)// El enrutador que definimos anteriormente se usa si la URL de la solicitud comienza con /api/blogs.
// Por esta razón, el objeto blogsRouter en blogs.js solo debe definir las partes relativas de las rutas, es decir, la ruta vacía / o solo el parámetro /:id.
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

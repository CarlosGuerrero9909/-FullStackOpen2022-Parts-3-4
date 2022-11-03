const express = require('express')
const morgan = require('morgan')

//nuestro propido token 'body' que retorna el body de la peticion en formato json
morgan.token('body', request => JSON.stringify(request.body))

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')) //usa dicha configuracion de manera global para todas las peticiones

let persons = [
	{
		name: "Arto Hellas",
		number: "3230923032",
		id: 1
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4
	}
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/info', (request, response) => {
	response.send(`
		Phonebook has info for ${persons.length} people <br></br>
		${new Date()}
	`)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	if (person)
		response.json(person)
	else
		response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response) => {
	const body = request.body

	if (!body.name || !body.number)
		return response.status(400).json({ 
      error: 'content missing' 
    })

	if(persons.find(person => person.name === body.name))
		return response.status(400).json({ 
      error: 'name must be unique' 
    })

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 100)
	}
	persons = persons.concat(person)
	response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})






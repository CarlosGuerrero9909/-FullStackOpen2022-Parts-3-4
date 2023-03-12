// Todas las rutas relacionadas con los blogs están ahora en el módulo blogs.js bajo el directorio controllers.
const blogsRouter = require('express').Router()// Enrutador de express que define las rutas relacionadas en un solo lugar
const Blog = require('../models/blog')

// el uso de async/await junto a express-async-errors nos ahorra varias lineas de código
blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({}).populate('user', {
      username: 1,
      name: 1,
      id: 1
    })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  // middleware userExtractor permite acceder a request.user
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user
  })

  if (blog.title === undefined && blog.url === undefined) {
    response.status(400).end()
  } else if (blog.likes === undefined) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  // falta el token o es invalido
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // token enviado con la solicitud NO es el mismo que el del creador del blog.
  if (user.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'unauthorized token' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter

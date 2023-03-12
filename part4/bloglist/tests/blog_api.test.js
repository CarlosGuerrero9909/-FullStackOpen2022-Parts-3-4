const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')

// las pruebas pueden usar la variable api (que envuelve a app.js) para realizar solicitudes HTTP al backend.
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('./../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('123456', saltRounds)

  const user = new User({
    username: 'testUser',
    name: 'test user',
    blogs: [],
    passwordHash
  })

  await user.save()
})

// Inicialicemos la base de datos antes de cada prueba con la función beforeEach, esta esta en el mismo estado antes de ejecutar cada prueba
beforeEach(async () => {
  await Blog.deleteMany({})

  const users = await User.find({})
  const user = users[0]
  const id = users[0]._id

  const blogsWithUser = helper.listWithManyBlogs
    .map(blog => new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: id.toString(),
      likes: blog.likes ? blog.likes : 0
    })
    )

  const promiseArray = blogsWithUser.map(blog => {
    blog.save()
    user.blogs = user.blogs.concat(blog._id)
  })
  await Promise.all(promiseArray)
  await user.save()
})

describe('Get request', () => {
  // Verifica que la aplicación de la lista de blogs devuelva la cantidad correcta de publicaciones de blog en formato JSON.
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.listWithManyBlogs.length)
  })

  // verifica que la propiedad de identificador único de las publicaciones del blog se llame id
  test('unique identifier property of blog is id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('Post request', () => {
  let headers

  beforeEach(async () => {
    const user = {
      username: 'testUser',
      password: '123456'
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)

    headers = {
      Authorization: `bearer ${loginUser.body.token}`
    }
  })

  // verifica que al realizar una solicitud HTTP POST a la URL /api/blogs se crea correctamente una nueva publicación de blog.
  test('a new blog is successfully created', async () => {
    const newBlog = {
      title: 'When a Picture Is Worth More Than Words',
      author: 'Yuanpei Cao',
      url: 'https://medium.com/airbnb-engineering/when-a-picture-is-worth-more-than-words-17718860dcc2',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'When a Picture Is Worth More Than Words'
    )
  })

  test('a new blog is send without token', async () => {
    const newBlog = {
      title: 'When a Picture Is Worth More Than Words',
      author: 'Yuanpei Cao',
      url: 'https://medium.com/airbnb-engineering/when-a-picture-is-worth-more-than-words-17718860dcc2',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  // verifica que si la propiedad likes falta en la solicitud, tendrá el valor 0 por defecto.
  test('send a blog without likes property', async () => {
    const newBlog = {
      title: 'Motion Engineering at Scale',
      author: 'Cal Stephens',
      url: 'https://medium.com/airbnb-engineering/motion-engineering-at-scale-5ffabfc878'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
  })

  // verifica que si faltan las propiedades title y url de los datos solicitados, el backend responde a la solicitud con el código de estado 400 Bad Request.
  test('send a blog without title and url properties', async () => {
    const newBlog = {
      author: 'NN',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400) // fue necesario configurar los requisitos en el método post del blogs.js

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
  })

  test('a new blog is send without correct header', async () => {
    const newBlog = {
      title: 'When a Picture Is Worth More Than Words',
      author: 'Yuanpei Cao',
      url: 'https://medium.com/airbnb-engineering/when-a-picture-is-worth-more-than-words-17718860dcc2',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(
      'When a Picture Is Worth More Than Words'
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})

const favoriteBlog = require('../utils/list_helper').favoriteBlog
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')

describe('favorite blog', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = favoriteBlog(listWithOneBlog)
    // cuando está comparando objetos, el método toEqual es probablemente lo que desea usar
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blogs, equals the likes sum of those', () => {
    const result = favoriteBlog(listWithManyBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

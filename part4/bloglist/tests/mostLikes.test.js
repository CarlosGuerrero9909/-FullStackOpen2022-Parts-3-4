const mostLikes = require('../utils/list_helper').mostLikes
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')

describe('most likes', () => {
  test('when list has one blog, equals to that blog', () => {
    const result = mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blogs, equals to Edsger W. Dijkstra', () => {
    const result = mostLikes(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})

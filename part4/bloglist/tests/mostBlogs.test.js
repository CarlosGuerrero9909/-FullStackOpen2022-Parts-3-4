const mostBlogs = require('../utils/list_helper').mostBlogs
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')

describe('most blogs', () => {
  test('when list has one blog, equals to that blog', () => {
    const result = mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has many blogs, equals to Robert C. Martin', () => {
    const result = mostBlogs(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

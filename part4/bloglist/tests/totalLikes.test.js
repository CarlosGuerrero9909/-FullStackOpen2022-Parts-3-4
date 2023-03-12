const totalLikes = require('../utils/list_helper').totalLikes
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has many blogs, equals the likes sum of those', () => {
    const result = totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

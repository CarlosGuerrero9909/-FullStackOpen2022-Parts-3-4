const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // suma los likes de cada uno de los blogs
  const reducer = blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)

  return reducer
}

const favoriteBlog = (blogs) => {
  // halla la mayor cantidad de likes en los blogs
  const maxLikes = blogs.reduce((max, blog) => {
    return Math.max(max, blog.likes)
  }, -Infinity)

  // busca cual es el blog con la mayor cantidad de likes
  const blog = blogs.find(blog => blog.likes === maxLikes)

  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const mostBlogs = (blogs) => {
  // arreglo con autores de los blogs
  const authors = blogs.map(blog => blog.author)

  // halla el autor que mas se repite en el arreglo de autores
  let repet = 0
  let maxAparitions = 0
  let maxAuthor = ''

  authors.map(author => {
    repet = 0
    authors.map(authorX => {
      if (author === authorX) { repet++ }
    })
    if (repet > maxAparitions) {
      maxAparitions = repet
      maxAuthor = author
    }
  })

  return {
    author: maxAuthor,
    blogs: maxAparitions
  }
}

const mostLikes = (blogs) => {
  // arreglo con autores de los blogs
  const authors = blogs.map(blog => blog.author)

  // hallar el autor con mayor numero de likes
  let likes = 0
  let maxLikes = 0
  let maxAuthor = ''

  authors.map(author => {
    likes = 0
    blogs.map(blog => {
      if (author === blog.author) {
        likes += blog.likes
      }
    })
    if (likes > maxLikes) {
      maxLikes = likes
      maxAuthor = author
    }
  })

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

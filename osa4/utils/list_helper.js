const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, curr) => (curr.likes > prev.likes ? curr : prev))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.countBy(blogs, 'author')
  const author = _.maxBy(Object.keys(grouped), (key) => grouped[key])

  return {
    author,
    blogs: grouped[author]
  }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    const likesPerAuthor = _.reduce(
      blogs,
      (result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes
        return result
      },
      {}
    )
    const author = _.maxBy(Object.keys(likesPerAuthor), (key) => likesPerAuthor[key])
    return {
      author,
      likes: likesPerAuthor[author]
    }
  }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

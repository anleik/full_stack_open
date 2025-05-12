const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  if (likes === undefined) {
    return res.status(400).json({ error: 'likes field is required' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.json(updatedBlog)
})

module.exports = blogsRouter

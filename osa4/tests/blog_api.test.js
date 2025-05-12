const mongoose = require('mongoose')
const { test, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('Fetching blogs', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.status, 200)
    assert.match(response.headers['content-type'], /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have an id field instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach((blog) => {
      assert.ok(blog.id, 'Blog should have an id field')
      assert.strictEqual(blog._id, undefined, 'Blog should not have an _id field')
    })
  })
})

describe('Creating blogs', () => {
  test('a valid blog can be added', async () => {
    const blogsAtStart = await helper.initialBlogs.length

    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = response.body

    assert.strictEqual(blogsAtEnd.length, blogsAtStart + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert.ok(titles.includes(helper.newBlog.title))
  })

  test('if likes is not provided, it defaults to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    assert.strictEqual(savedBlog.likes, 0, 'Default value for likes should be 0')
  })

  test('blog without title is not added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.blogWithoutTitle)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.blogWithoutUrl)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

test.after(async () => {
  await mongoose.connection.close()
})

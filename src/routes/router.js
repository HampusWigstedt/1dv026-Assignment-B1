/**
 * @file Defines the main router.
 * @module router
 * @author Hampus Vigstedt
 */

import express from 'express'
import http from 'node:http'
import bcrypt from 'bcrypt'
import { User } from '../models/UserModel.js'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetRouter } from './snippetRouter.js'
import { router as registerRouter } from './registerRouter.js'


const router = express.Router()

/**
 * Middleware for checking if user is authenticated.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function checkAuth (req, res, next) {
  if (!req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}

// Registration route
router.get('/register', (req, res) => {
  res.render('register/register')
})

router.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    username: req.body.username,
    password: hashedPassword
  })
  await user.save()
  req.session.userId = user._id
  res.redirect('/') // redirect to your default page
})


// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

// Protected route example
router.get('/protected', checkAuth, (req, res) => {
  res.render('protected') // replace with your protected EJS view
})

router.use('/', homeRouter)
router.use('/snippets', snippetRouter)
router.use('/register', registerRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})

export { router }

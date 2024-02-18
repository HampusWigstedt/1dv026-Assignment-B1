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
import { router as loginRouter } from './loginRouter.js'

const router = express.Router()

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

router.use('/', homeRouter)
router.use('/snippets', snippetRouter)
router.use(registerRouter)
router.use(loginRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})

export { router }

/**
 * @file Defines the main router.
 * @module router
 * @author Hampus Vigstedt
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetRouter } from './snippetRouter.js'
import { router as registerRouter } from './registerRouter.js'
import { router as loginRouter } from './loginRouter.js'
import { UserController } from '../controllers/UserController.js'

const router = express.Router()

const userController = new UserController()

router.post('/register', userController.registerNewUser.bind(userController))

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

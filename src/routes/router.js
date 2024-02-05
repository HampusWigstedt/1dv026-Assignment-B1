/**
 * @file Defines the main router.
 * @module router
 * @author Mats Loock
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetRouter } from './snippetRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', snippetRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})

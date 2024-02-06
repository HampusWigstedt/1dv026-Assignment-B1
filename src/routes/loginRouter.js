// loginRouter.js
import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

router.get('/', (req, res, next) => controller.loginUser(req, res, next))

router.post('/', (req, res, next) => controller.authenticate(req, res, next))

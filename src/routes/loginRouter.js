import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

// Route for handling login form submission
router.post('/', (req, res) => controller.loginUser(req, res))

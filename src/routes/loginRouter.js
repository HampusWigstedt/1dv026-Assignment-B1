import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

// Route for displaying login form
router.get('/login', (req, res) => controller.LoginForm(req, res))

// Route for handling login form submission
router.post('/login', (req, res) => controller.loginUser(req, res))

router.get('/logout', (req, res) => controller.logoutUser(req, res))

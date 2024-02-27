import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

// Route for displaying login form
router.get('/login', controller.redirectIfLoggedIn, (req, res) => controller.LoginForm(req, res))

// Route for handling login form submission
router.post('/login', (req, res, next) => {
  controller.loginUser(req, res, next)
})

router.get('/logout', (req, res) => controller.logoutUser(req, res))

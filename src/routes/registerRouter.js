/**
 * @file Defines the home router.
 * @module homeRouter
 * @author Hampus Vigstedt
 */

import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

// router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/register', (req, res) => controller.RegisterForm(req, res))

router.post('/register', (req, res) => controller.registerNewUser(req, res))

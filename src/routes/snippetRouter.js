/**
 * @file Defines the snippet router.
 * @module snippetRouter
 * @author Hampus Vigstedt
 */
// src/routes/snippetRouter.js
import express from 'express'
import { SnippetController } from '../controllers/SnippetController.js'

export const router = express.Router()

const controller = new SnippetController()
const authenticated = controller.ensureAuthenticated

// lägg till en autherice för create, update och delete

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadsnippetDocument(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/create', authenticated, (req, res, next) => controller.create(req, res, next))
router.post('/create', authenticated, (req, res, next) => controller.createPost(req, res, next))

router.get('/:id/update', authenticated, (req, res, next) => controller.update(req, res, next))
router.post('/:id/update', authenticated, (req, res, next) => controller.updatePost(req, res, next))

router.get('/:id/delete', authenticated, (req, res, next) => controller.delete(req, res, next))
router.post('/:id/delete', authenticated, (req, res, next) => controller.deletePost(req, res, next))

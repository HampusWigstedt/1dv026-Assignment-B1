/**
 * @file Defines the snippetController class.
 * @module snippetController
 * @author Hampus Vigstedt
 */

import { snippetModel } from '../models/SnippetModel.js'

/**
 * Encapsulates a controller.
 */
export class SnippetController {
  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the snippet to load.
   */
  async loadsnippetDocument (req, res, next, id) {
    try {
      // Get the snippet document.
      const snippetDoc = await snippetModel.findById(id)

      // If the snippet document is not found, throw an error.
      if (!snippetDoc) {
        const error = new Error('The snippet you requested does not exist.')
        error.status = 404
        throw error
      }

      // Provide the snippet document to req.
      req.doc = snippetDoc

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of all snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        snippets: (await snippetModel.find())
          .map(snippetDoc => snippetDoc.toObject())
      }

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    res.render('snippets/create', { csrfToken: req.csrfToken() })
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createPost (req, res) {
    try {
      const { description } = req.body

      await snippetModel.create({
        description,
        userId: req.session.userId // Store the user ID in the snippet document
      })

      req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./create')
    }
  }

  /**
   * Returns a HTML form for updating a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      const viewData = req.doc.toObject()
      viewData.csrfToken = req.csrfToken()
      res.render('snippets/update', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Update post.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {void}
   */
  async updatePost (req, res, next) {
    try {
      // Check if the user is authenticated
      if (!req.session.userId) {
        const err = new Error('Snippet not found')
        err.status = 404
        return next(err)
      }

      // Check if the user is the owner of the snippet
      if (req.session.userId !== req.doc.userId.toString()) {
        const err = new Error('You are not authorized to update this snippet')
        err.status = 403
        return next(err)
      }

      if ('description' in req.body) req.doc.description = req.body.description

      if (req.doc.isModified()) {
        await req.doc.save()
        req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      } else {
        req.session.flash = { type: 'info', text: 'The snippet was not updated because there was nothing to update.' }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML form for deleting a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      const viewData = req.doc.toObject()
      viewData.csrfToken = req.csrfToken()
      res.render('snippets/delete', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified snippet if the logged-in user is the owner of the snippet.
   *
   * @param {object} req - Express request object. The request should contain a session object with the userId of the logged-in user, and a doc object with the snippet to delete and the userId of the snippet's owner.
   * @param {object} res - Express response object. The method will send a redirect response to the client.
   * @param {Function} next - The next middleware function in the application’s request-response cycle.
   * @throws Will redirect to the delete page and flash an error message if an error occurs or if the user is not authorized to delete the snippet.
   * @returns {Promise<void>} A Promise that resolves when the method has finished sending the response. If the snippet was deleted, the method will flash a success message.
   */
  async deletePost (req, res, next) {
    try {
      // Check if the user is authenticated
      if (!req.session.userId) {
        const err = new Error('Snippet not found')
        err.status = 404
        return next(err)
      }

      // Check if the user is the owner of the snippet
      if (req.session.userId !== req.doc.userId.toString()) {
        const err = new Error('You are not authorized to delete this snippet')
        err.status = 403
        return next(err)
      }

      // Rest of the code...
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
    try {
      await req.doc.deleteOne()

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
  }

  /**
   * Middleware to ensure that the user is authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async ensureAuthenticated (req, res, next) {
    if (req.session.userId) {
      // If the user is authenticated, proceed to the next middleware or route handler
      next()
    } else {
      const err = new Error('Unauthorized: You must be logged in to access this resource.')
      err.status = 404
      next(err)
    }
  }
}

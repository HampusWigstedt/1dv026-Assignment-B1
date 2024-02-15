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
    res.render('snippets/create')
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createPost (req, res) {
    try {
      const { description, done } = req.body

      await snippetModel.create({
        description,
        done: done === 'on',
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
      res.render('snippets/update', { viewData: req.doc.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific snippet if the logged-in user is the owner of the snippet.
   *
   * @param {object} req - Express request object. The request should contain a session object with the userId of the logged-in user, and a doc object with the snippet to update and the userId of the snippet's owner.
   * @param {object} res - Express response object. The method will send a redirect response to the client.
   * @throws Will redirect to the update page and flash an error message if an error occurs or if the user is not authorized to update the snippet.
   * @returns {Promise<void>} A Promise that resolves when the method has finished sending the response. If the snippet was updated, the method will flash a success message. If the snippet was not updated because there was nothing to update, the method will flash an info message.
   */
  async updatePost (req, res) {
    try {
    // Check if the user is the owner of the snippet
      // if (req.session.userId !== req.doc.userId.toString()) {
      //   req.session.flash = { type: 'danger', text: 'You are not authorized to update this snippet.' }
      //   return res.redirect('..')
      // }

      if ('description' in req.body) req.doc.description = req.body.description
      if ('done' in req.body) req.doc.done = req.body.done === 'on'

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
      res.render('snippets/delete', { viewData: req.doc.toObject() })
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
   * @throws Will redirect to the delete page and flash an error message if an error occurs or if the user is not authorized to delete the snippet.
   * @returns {Promise<void>} A Promise that resolves when the method has finished sending the response. If the snippet was deleted, the method will flash a success message.
   */
  async deletePost (req, res) {
    try {
      // Check if the user is the owner of the snippet
      // if (req.session.userId !== req.doc.userId.toString()) {
      //   req.session.flash = { type: 'danger', text: 'You are not authorized to delete this snippet.' }
      //   return res.redirect('..')
      // }

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
}

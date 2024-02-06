import bcrypt from 'bcrypt'
import { User } from '../models/UserModel.js'

/**
 * Controller for managing user operations.
 */
export class UserController {
  // Other methods...

  /**
   * Registers a new user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the user is registered.
   */
  async registerNewUser (req, res) {
    const { username, password } = req.body

    // Validate the username and password
    if (!username || !password) {
      req.session.flash = { type: 'danger', text: 'Username and password are required' }
    }
    if (password.length < 8) {
      req.session.flash = { type: 'danger', text: 'Password must be at least 8 characters long' }
    }
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      username,
      password: hashedPassword
    })
    try {
      await user.save()
      req.session.userId = user._id
      res.redirect('/') // redirect to your default page
    } catch (err) {
      if (err.code === 11000) {
        // This error occurs when a duplicate username is found
        req.session.flash = { type: 'danger', text: 'Username already exists' }
      } else {
        req.session.flash = { type: 'danger', text: 'Error' }
      }
    }
  }

  /**
   * Logs in a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the user is logged in.
   */
  async loginUser (req, res) {
    const { username, password } = req.body

    // Find the user by username
    const user = await User.findOne({ username })

    // If the user doesn't exist, send an error message
    if (!user) {
      req.session.flash = { type: 'danger', text: 'Wrong username or password' }
      return res.redirect('home/index') // redirect back to the login page
    }

    // If the password is incorrect, send an error message
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      req.session.flash = { type: 'danger', text: 'Wrong username or password' }
      return res.redirect('home/index') // redirect back to the login page
    }

    // If the user exists and the password is correct, log in the user
    req.session.userId = user._id
    res.redirect('home/index') // redirect to your default page
  }

  /**
   * Displays a list of all users.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        users: (await User.find())
          .map(userDoc => userDoc.toObject())
      }

      res.render('register/register', { viewData })
    } catch (error) {
      next(error)
    }
  }
}

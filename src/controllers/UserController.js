import bcrypt from 'bcrypt'
import { User } from '../models/UserModel.js'

/**
 * Controller for managing user operations.
 */
export class UserController {
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
        req.session.flash = { type: 'danger', text: 'Username already exists' }
        return res.redirect('/register')
      }
      req.session.flash = { type: 'danger', text: 'Error' }
      return res.redirect('/register')
    }
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

  /**
   * Logs in a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {void}
   */
  async loginUser (req, res) {
    const { username, password } = req.body

    try {
      // Use the authenticate method to validate the user
      const user = await User.authenticate(username, password)

      // If the user is valid, log them in
      req.session.userId = user._id
      res.locals.user = user
      req.session.flash = { type: 'success', text: 'You have signed in' }
      res.redirect('/')
    } catch (error) {
      // If the user is not valid, send an error message
      req.session.flash = { type: 'danger', text: 'Invalid username or password' }
      res.redirect('/login')
    }
  }

  /**
   * Renders the login form.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  LoginForm (req, res) {
    res.render('login/login')
  }

  /**
   * Logs out a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {void}
   */
  logoutUser (req, res) {
    req.session.destroy(err => {
      if (err) {
        console.log(err)
      }
      console.log('User logged out')
      req.session.flash = { type: 'success', text: 'You have signed out' }
      res.redirect('/')
    })
  }
}

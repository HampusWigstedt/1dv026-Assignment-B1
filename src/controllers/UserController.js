import bcrypt from 'bcrypt'
import { User } from '../models/UserModel.js'

/**
 * Controller for managing user operations.
 */
export class UserController {
  //

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
      return res.redirect('./register')
    }
    if (password.length < 8) {
      req.session.flash = { type: 'danger', text: 'Password must be at least 8 characters long' }
      return res.redirect('./register')
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/
    if (!usernameRegex.test(username) || !usernameRegex.test(password)) {
      req.session.flash = { type: 'danger', text: 'Username and password can only contain letters and numbers' }
      return res.redirect('./register')
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
      req.session.flash = { type: 'success', text: 'You have registered a new account. Please sign in' }
      res.redirect('./') // redirect to your default page
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        req.session.flash = { type: 'danger', text: 'Username already exists' }
      } else {
        req.session.flash = { type: 'danger', text: 'Username already exists' }
      }
      return res.redirect('./register')
    }
  }

  // Registration route
  /**
   * Renders the registration form.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {void}
   */
  RegisterForm = (req, res) => {
    res.render('register/register', { csrfToken: req.csrfToken() })
  }

  /**
   * Logs in a user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {void}
   */
  async loginUser (req, res, next) {
    const { username, password } = req.body

    const usernameRegex = /^[a-zA-Z0-9]+$/
    if (!usernameRegex.test(username) || !usernameRegex.test(password)) {
      req.session.flash = { type: 'danger', text: 'Username and password can only contain letters and numbers' }
      return res.redirect('./login')
    }

    try {
      // Use the authenticate method to validate the user
      const user = await User.authenticate(username, password)

      // If the user is valid, log them in
      req.session.userId = user._id
      req.session.user = user // Add the user object to the session
      res.locals.user = user
      req.session.flash = { type: 'success', text: 'You have signed in' }
      res.redirect('./')
    } catch (error) {
      // If the user is not valid, send an error message
      const err = new Error('Unauthorized: Invalid username or password')
      err.status = 401
      next(err)
      req.session.flash = { type: 'danger', text: 'Invalid username or password' }
      res.redirect('./login')
    }
  }

  /**
   * Renders the login form.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  LoginForm = (req, res) => {
    res.render('login/login', { csrfToken: req.csrfToken() })
  }

  /**
   * Redirects to the home page if the user is already logged in.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {void}
   */
  redirectIfLoggedIn (req, res, next) {
    if (req.session && req.session.user) {
      res.redirect('./') // Redirect to home page if user is logged in
    } else {
      next()
    }
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
      res.redirect('./')
    })
  }
}

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
    const { username, password } = req.body // Extract username and password from request body

    // Find the user in the database
    const user = await User.findOne({ username })

    // If user doesn't exist, redirect to home page with an error message
    if (!user) {
      req.flash('error', 'Invalid username or password')
      return res.redirect('/')
    }

    // If user exists, compare the provided password with the stored password
    const isMatch = await user.comparePassword(password)

    // If the passwords don't match, redirect to home page with an error message
    if (!isMatch) {
      req.flash('error', 'Invalid username or password')
      console.log('Invalid username or password')
      return res.redirect('/')
    }

    // If the passwords match, the user is authenticated.
    // You might want to create a session or a token here.
    req.session.userId = user._id
    console.log('User logged in:', user.username)

    // Redirect to the home page
    return res.redirect('/')
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
      res.redirect('/')
    })
  }
}

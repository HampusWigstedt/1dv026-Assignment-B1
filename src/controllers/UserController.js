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
      return res.send('Username and password are required')
    }
    if (password.length < 8) {
      return res.send('Password must be at least 8 characters long')
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
        res.send('Username already exists')
      } else {
        res.send('An error occurred while registering')
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

    // If the user doesn't exist or the password is incorrect, send an error message
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('flash', { type: 'danger', text: 'Wrong password or username' })
      return res.redirect('/login') // redirect back to the login page
    }

    // If the user exists and the password is correct, log in the user
    req.session.userId = user._id
    res.redirect('/') // redirect to your default page
  }
}

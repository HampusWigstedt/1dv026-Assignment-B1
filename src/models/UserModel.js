import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

/**
 * Compare the provided password with the user's password.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
UserSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  console.log(user)
  if (!user) {
    throw new Error('User not found')
  }
  const match = await bcrypt.compare(password, user.password)
  console.log('password: ' + password)
  console.log('userPassword: ' + user.password)
  console.log('Match: ' + match)
  if (!match) {
    throw new Error('Invalid password')
  }
  return user
}

const User = mongoose.model('User', UserSchema)

export { User }

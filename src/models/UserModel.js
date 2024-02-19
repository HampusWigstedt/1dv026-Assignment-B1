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

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

/**
 * Compare the provided password with the user's password.
 *
 * @param {string} username - The username to compare.
 * @param {string} password - The password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
UserSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user) {
    throw new Error('Invalid username')
  }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    throw new Error('Invalid password')
  }
  return user
}

const User = mongoose.model('User', UserSchema)

export { User }

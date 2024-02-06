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
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
}

const User = mongoose.model('User', UserSchema)

export { User }

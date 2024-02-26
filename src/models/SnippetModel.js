/**
 * @file Defines the snippet model.
 * @module snippetModel
 * @author Hampus Vigstedt
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  userId: { // Add this field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with the name of your user model if it's different
    required: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const snippetModel = mongoose.model('snippet', schema)

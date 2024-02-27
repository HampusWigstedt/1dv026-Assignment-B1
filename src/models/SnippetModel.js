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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const snippetModel = mongoose.model('snippet', schema)

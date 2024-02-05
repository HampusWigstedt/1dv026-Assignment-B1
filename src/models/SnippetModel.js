/**
 * @file Defines the snippet model.
 * @module snippetModel
 * @author Mats Loock
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
  done: {
    type: Boolean,
    required: true,
    default: false
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const snippetModel = mongoose.model('snippet', schema)

import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  scopes: {
    type: [String],
    default: []
  }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)

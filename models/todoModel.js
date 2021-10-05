import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'users' }
}, { timestamps: true })

let Dataset = mongoose.models.todo || mongoose.model('todo', todoSchema)
export default Dataset;
let mongoose = require('mongoose')

let postSchema = new mongoose.Schema({
  body: String
})

module.exports = mongoose.model('Post', postSchema)

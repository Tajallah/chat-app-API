let mongoose = require('mongoose')

let postSchema = new mongoose.Schema({
  header: {
    type:String
    required:true
  }
  identity: {
    type:String,
    required:true
  },
  body: {
    type:String,
    required:true
  },
  timeStamp: {
    type:Date,
    required:true,
    default:Date.now,
  }
})

module.exports = mongoose.model('Post', postSchema)

let mongoose = require('mongoose')

let personas = new mongoose.Schema({
  username: {
    type:String,
    required:true
  },
  avatar: {
    type:String,
    required:true
  },
  publicKey: {
    type:String,
    required:true
  },
  ring: {
    type:Number,
    rquired:true,
    default:3
  }
})

module.exports = mongoose.model('personas', personas)

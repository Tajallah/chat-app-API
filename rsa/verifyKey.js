NodeRSA = require('node-rsa')

module.exports.verifyKey = function (msgObj) {
  const key = new NodeRSA()
  console.log(msgObj)
  key.importKey(msgObj.identity, 'openssh-public')
  if (key.verify(message.signature)){
    return true
  } else {
    return false
  }
}

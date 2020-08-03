NodeRSA = require('node-rsa')

function verifyKey(msgObj) {
  const key = new NodeRSA()
  key.importKey(msgObj.identity, openssh)
  decryptedHeader = key.decrypt(encrypted, 'utf8')
  msgString = body.concat(timestamp.toString())
  if (msgString === decryptedHeader) ? return true:return false
}

export default verifyKey;

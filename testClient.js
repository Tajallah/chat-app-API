const NodeRSA = require('node-rsa')
const Request = require('request')
const utf8 = require('utf8')

function generateTestPersonas () {
  console.log("generate test personas")
  const key = new NodeRSA({b: 512})
  const test1 = {
    username: "test1",
    avatar: "--",
    publicKey: key.exportKey('openssh-public'),
    privateKey: key.exportKey('openssh-private'),
  }
  const key2 = new NodeRSA({b: 512})
  const test2 = {
    username: "test2",
    avatar: "--",
    publicKey: key2.exportKey('openssh-public'),
    privateKey: key2.exportKey('openssh-private'),
  }
  return [test1, test2]
}

function registerWithServer (persona) {
  console.log("register with server")
  const outgoingPersona = {
    username : persona.username,
    avatar : persona.avatar,
    publicKey : persona.publicKey,
  }
  Request(
    {
      method: 'POST',
      uri: 'http://localhost:8000/registerUser',
      json : outgoingPersona
    },
    (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log('register response: ', res.body)
    const msg = createMessage("This is a message from test1", persona)
    sendMessage(msg)
    //console.log(outgoingPersona)
  })
}

function createMessage (text, persona) {
  console.log("create message")
  const key = new NodeRSA()
  //console.log(persona.privateKey)
  key.importKey(persona.privateKey, 'openssh-private')
  const message = {
    identity : persona.publicKey,
    body : utf8.encode(text),
    timestamp : utf8.encode(Date.now().toString()),
    signature : message.body.concat(message.timestamp.toString())
  }
  message.signature = Buffer.from(message.signature, 'base64')
  console.log(message)
  return message
}

function sendMessage (msg) {
  console.log("send message")
  Request(
    {
      method: 'POST',
      uri: 'http://localhost:8000/newmsg',
      json : msg
    },
    (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log('message response: ', res.body)
    //console.log(msg)
  })
}

function doThread(persona) {
  registerWithServer(persona)
}

function testMessages () {
  console.log("start")
  personas = generateTestPersonas()
  doThread(personas[0])
  doThread(personas[1])
  console.log("end")
}

testMessages()

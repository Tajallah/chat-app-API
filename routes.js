'use strict'
//const NodeRSA = require('node-rsa')
const V = require('./rsa/verifyKey')
const simple = require('./handlers/simple')
const configured = require('./handlers/configured')
const database = require('./dataLayer/database')
let PostModel = require('./dataLayer/schema/posts')
let PersonaModel = require('./dataLayer/schema/personas')

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', simple)

  app.get('/configured', configured(opts))

  app.get('/testdb', (req, res) => {
    let msg = new PostModel({
      body: 'This is a test'
    })
    msg.save()
      .then(doc => {
        res.send(doc)
      })
      .catch(err => {
        res.send(err)
      })
  })

  //POSTS
  app.post('/registerUser', (req, res) => {
    console.log('Starting REGISTER NEW USER')
    let newUser = req.body
    console.log(newUser)
    console.log('IF STATEMENT')
    PersonaModel.findOne({publicKey:newUser.publicKey}, (err, data) => {
      console.log(data)
      if (data === null) {
        console.log("SAVING")
        let acceptedUser = new PersonaModel ({
          username: newUser.username,
          avatar: newUser.avatar,
          publicKey: newUser.publicKey,
        })
        acceptedUser.save()
          .then(doc => {res.json({success:true})})
          .catch(err => {
            console.log(err)
            res.json({
              success:false,
              error:err
            })
          })
      } else {
        console.log("DUPLICATE")
        res.json({
          success:false,
          error:"Public Key already registered on this server"
        })
      }
    })
  })

  app.post('/newmsg', (req, res) => {
    const msgObj = req.body
    PersonaModel.findOne({publicKey:msgObj.identity}, (err, data) => {
      if (data != null) {
        if (V.verifyKey(msgObj) === true) {
          let msg = new PostModel({
            signature: msgObj.signature,
            identity: msgObj.identity,
            body: msgObj.body,
            timestamp: msgObj.timeStamp
          })
          msg.save()
            .then(doc => {
              res.send(doc)
            })
            .catch(err => {
              res.send(err)
            })
        } else {
          res.send({
            success:false,
            error:"invalid signature"
          })
        }
    } else {
      res.send({
        success:false,
        error:"no such user"
      })
    }
    })
  })

}

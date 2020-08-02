'use strict'

module.exports = function (req, res) {
  console.log("verifying key")
  const payload = req.body
  res.send("verifying Key")
}

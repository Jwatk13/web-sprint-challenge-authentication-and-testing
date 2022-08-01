const { findBy } = require('./auth-model');

// 3- On FAILED registration due to `username` or `password` missing from the request body,
//       the response body should include a string exactly as follows: "username and password required".

// 4- On FAILED registration due to the `username` being taken,
//       the response body should include a string exactly as follows: "username taken".

function validateUser(req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        return next({ message: "username and password required" })
    }
    next() 
}

async function checkUsernameFree(req, res, next) {
    try {
      const users = await findBy({ username: req.body.username })
      if (!users.length) {
        next()
      } else {
        next({ message: "username taken" })
      }
    } catch (err) {
      next (err)
    }
  }

async function validateUsername (req, res, next) {
    try {
        const [user] = await findBy({ username: req.body.username })
        if (!user) { 
            next({ message: 'invalid credentials' })
        } else {
            req.user = user
            next()
        }
        } catch (err) {
            next(err)
    }
}

module.exports = {
    validateUser,
    checkUsernameFree,
    validateUsername,
}
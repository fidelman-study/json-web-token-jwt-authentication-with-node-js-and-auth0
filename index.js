const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 8888

const users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'guest', password: 'guest' },
]

app.use(bodyParser.json())

app.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res
      .status(400)
      .send('You need a username and password')
    return
  }

  const user = users.find(user => (user.username === username && user.password === password))

  if (!user) {
    res
      .status(401)
      .send('User is not found')
    return
  }

  const token = jwt.sign({
    sub: user.id,
    username: user.username,
  }, 'mysupersectretkey', { expiresIn: '3 hours' })

  res
    .status(200)
    .json({ access_token: token })
})

app.get('/status', (req, res) => {
  const localTime = (new Date()).toLocaleDateString()

  res
    .status(200)
    .send(`Server time is ${localTime}`)
})

app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 8080
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
app.use(cors())
const router = require('./routes/index')

// parse application/x-www-form-urlencoded
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api', router)


const start = async () => {

  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}!`))
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (error) {
    console.log(error)
  }
}

start();

// app.get('/', (req, res) => res.send('Hello World!'))
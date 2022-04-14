const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 8080
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
app.use(cors())
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

// parse application/x-www-form-urlencoded
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))

app.use('/api', router)
app.use(errorHandler)


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
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors')
const router = require('./routers')
const errorHandler = require('./middleware/errorMidleware')

require('dotenv').config()

mongoose.set('strictQuery', false)
const PORT = process.env.port || 8000

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(router)

mongoose
	.connect(process.env.MONGO_LINK)
	.then(() => console.log('Установлено соединение с Mongo'))
	.catch(err => console.log('Соединение не установлено или прервано c MongoDB', err))

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`)
})

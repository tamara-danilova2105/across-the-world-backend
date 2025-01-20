const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    alt: { type: String, required: true }
})

const timerSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    timer: {type: String, required: true},
    images: [imageSchema]
})

module.exports = mongoose.model(`Timer`, timerSchema)
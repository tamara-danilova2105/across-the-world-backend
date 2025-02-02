const mongoose = require('mongoose')

const timerSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    timer: {type: Date, required: true},
    region: {type: String, required: true},
    images: [
        {
            _id: { type: String, required: true },
            src: { type: String, required: true },
            header: {type: String, required: true },
            category: {type: String, required: true },
            describe: {type: String, required: true },
        },
    ],
})

module.exports = mongoose.model(`Timer`, timerSchema) 
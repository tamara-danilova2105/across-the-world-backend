const mongoose = require('mongoose')

const timerSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    region: { type: String, required: true },
    timer: {type: Date, required: true},
    imagesWithDetail: [{
        _id: { type: String, default: uuidv4 },
        src: { type: String, required: true },
        header: {type: String, required: true },
        category: {type: String, required: true },
        describe: {type: String, required: true },
    }],
})

module.exports = mongoose.model(`Timer`, timerSchema)
const mongoose = require('mongoose');

const ReviewsSchema = new mongoose.Schema({
    name: {type: String, require: true},
    city: {type: String},
    direction: {type: String, require: true},
    review: {type: String, require: true},
    isModeration: {type: Boolean, default: false}

}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model('Review', ReviewsSchema)
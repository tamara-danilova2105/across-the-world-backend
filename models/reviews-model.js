const mongoose = require('mongoose');

const ReviewsSchema = new mongoose.Schema({
    name: {type: String, require: true},
    city: {type: String},
    feedback: {type: String, require: true},
    isModeration: {type: Boolean, default: false},
    tourId: {type: String, require: true},

}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model('Review', ReviewsSchema)
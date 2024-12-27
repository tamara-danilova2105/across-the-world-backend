const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: `Admin`},
    refreshToken: { type: String, required: true}
})

module.exports = mongoose.model(`Token`, tokenSchema)
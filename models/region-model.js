const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
    direction: {
        type: String,
        enum: ['Россия', 'Заграница'],
        required: true
    },
    region: {
        type: String,
        required: true,
        unique: true, // Запрещает дублировать регионы
        trim: true
    }
});

module.exports = mongoose.model('Region', RegionSchema);

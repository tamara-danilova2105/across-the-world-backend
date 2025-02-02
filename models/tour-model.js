const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['₽', '$'], required: true },
});

const dateTourSchema = new mongoose.Schema({
    date_start: { type: Date, required: true },
    date_finish: { type: Date, required: true },
    price: { type: priceSchema, required: true },
    spots: { type: Number, required: true, min: 0 },
});

const locationSchema = new mongoose.Schema({
    place_start: { type: String, required: true },
    place_finish: { type: String, required: true },
});

const detailsSchema = new mongoose.Schema({
    included: { type: String, default: '' },
    notIncluded: { type: String, default: '' },
});

const discountSchema = new mongoose.Schema({
    endDate: { type: Date, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
});

const imageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    alt: { type: String, required: true },
});

const dayProgramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    images: [imageSchema],
});

const mapMarkerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: function (value) {
                return value.length === 2;
            },
            message: 'Координаты должны содержать ровно 2 числа (широта и долгота)',
        },
    },
});

const tourSchema = new mongoose.Schema(
    {
        types: {
            type: [String],
            enum: ['Трекинг', 'Ретрит / оздоровительный', 'Экскурсионный', 'Детский', 'Фототур'],
            required: true,
        },
        tour: { type: String, required: true },
        dates: { type: [dateTourSchema], required: true },
        locations: { type: locationSchema, required: true },
        details: { type: detailsSchema, required: true },
        imageCover: { type: [imageSchema], required: true },
        direction: {
            type: [String],
            enum: ['Россия', 'Заграница'],
            required: true,
        },
        regions: { type: [String], required: true },
        discount: { type: discountSchema },
        activity: {
            type: String,
            enum: ['Для всех', 'Низкий', 'Средний', 'Высокий', 'Очень высокий'],
            required: true,
        },
        comfort: {
            type: String,
            enum: ['Высокий', 'Уникальное жилье', 'Средний'],
            required: true,
        },
        description: { type: String, default: '' },
        program: { type: [dayProgramSchema], default: [] },
        hotels: { type: [imageSchema], default: [] },
        mapMarker: { type: [mapMarkerSchema], default: [] },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Tour', tourSchema);

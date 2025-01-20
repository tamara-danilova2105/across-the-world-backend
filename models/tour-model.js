const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['₽', '$'], required: true }
})

const dateTourSchema = new mongoose.Schema({
    date_start: { type: Date, required: true },
    date_finish: { type: Date, required: true },
    price: { type: priceSchema, required: true },
    spots: { type: Number, required: true, min: 0 }
})

const locationSchema = new mongoose.Schema({
    place_start: { type: String, required: true },
    place_finish: { type: String, required: true }
})

const detailsSchema = new mongoose.Schema({
    included: { type: String, default: '' },
    notIncluded: { type: String, default: '' }
})

const discountSchema = new mongoose.Schema({
    endDate: { type: Date, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 }
})

const imageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    alt: { type: String, required: true }
})

const dayProgramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    images: [imageSchema]
})

const tourSchema = new mongoose.Schema({
    tour: { type: String, required: true },
    dates: { type: [dateTourSchema], required: true },
    locations: { type: locationSchema, required: true },
    details: { type: detailsSchema, required: true },
    image: { type: [imageSchema], required: true },
    direction: { 
        type: String, 
        enum: ['Россия', 'Заграница'], 
        required: true 
    },
    region: { 
        type: String, 
        enum: ['Russia', 'Middle_East', 'Asia', 'South_America', 'Africa'], 
        required: true 
    },
    country: { 
        type: String, 
        enum: [
            'North_Caucasus', 'Kamchatka', 'Baikal', 'Kalmykia', 'Karelia',
            'Armenia', 'Iran', 'Turkey', 'Georgia', 'Socotra', 'Azerbaijan',
            'Uzbekistan', 'Pakistan', 'Japan', 'Argentina', 'Brazil',
            'Peru', 'Chile', 'Bolivia'
        ], 
        required: true 
    },
    discount: { type: discountSchema },
    activity: { 
        type: String, 
        enum: ['Для всех', 'Низкий', 'Средний', 'Высокий', 'Очень высокий'],
        required: true 
    },
    comfort: { 
        type: String, 
        enum: ['Высокий', 'Уникальное жилье', 'Средний'],
        required: true 
    },
    description: { type: String, default: '' },
    program: { type: [dayProgramSchema], default: [] },
    hotels: { type: [imageSchema], default: [] }
}, {
    timestamps: true 
})


module.exports = mongoose.model('Tour', tourSchema);
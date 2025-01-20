const tourModel = require('../models/tour-model')

class TourController {

    async getAllTours(req, res, next) {
        try {
            const tours = await tourModel.find()
            res.status(200).json(tours)
        } catch (error) {
            next(error)
        }
    }

    async getTour(req, res, next) {
        try {
            const { id } = req.params;
            const tour = await tourModel.findById(id)
            if (!tour) {
                return res.status(404).json({ message: 'Тур не найден' })
            }
            res.status(200).json(tour)
        } catch (error) {
            next(error)
        }
    }

    async addTour(req, res, next) {
        try {
            const { 
                tour, 
                dates, 
                locations, 
                details, 
                image, 
                direction, 
                region, 
                country, 
                discount, 
                activity, 
                comfort, 
                description, 
                program, 
                hotels 
            } = req.body
            
            const newTour = new tourModel({
                tour,
                dates,
                locations,
                details,
                image,
                direction,
                region,
                country,
                discount,
                activity,
                comfort,
                description,
                program,
                hotels
            })
            const savedTour = await newTour.save()
            res.status(200).json(savedTour)
        } catch (error) {
            next(error)
        }
    }

    async editTour(req, res, next) {
        try {
            const { id } = req.params;
            const updatedTour = await tourModel.findByIdAndUpdate(id, req.body)
            if (!updatedTour) {
                return res.status(404).json({ message: 'Тур не найден' })
            }
            res.status(200).json(updatedTour)
        } catch (error) {
            next(error)
        }
    }

    async deleteTour(req, res, next) {
        try {
            const { id } = req.params;
            const deletedTour = await tourModel.findByIdAndDelete(id)
            if (!deletedTour) {
                return res.status(404).json({ message: 'Тур не найден' })
            }
            res.status(200).json({ message: 'Тур успешно удалён' })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TourController()
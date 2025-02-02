const tourModel = require('../models/tour-model')
const { buildFilterQuery } = require('../utils/buildFilterQuery')
const { buildSortQuery } = require('../utils/buildSortQuery')

class TourController {
    async getAllTours(req, res, next) {
        try {
            const { sort, filter } = req.query;
            const parsedSort = sort ? JSON.parse(sort) : {}
            const sorting = buildSortQuery(parsedSort)

            const parsedFilter = filter ? JSON.parse(filter) : {}
            const filters = buildFilterQuery(parsedFilter)

            console.log(sort, filter)

            const { limit , page } = req.params;
            const parsedLimit = parseInt(limit)
            const parsedPage = parseInt(page)

            const tours = await tourModel.find(filters)
                .sort(sorting)
                .skip((parsedPage - 1) * parsedLimit)
                .limit(Number(parsedLimit))
            
            if (tours.length === 0) {
                return res.status(404).json({ message: 'Товары не найдены' });
            }
            
            const allTours = await tourModel.countDocuments(filters)

            res.status(200).json({
                tours,
                allTours,
                currentPage: Number(parsedPage),
                totalPages: Math.ceil(allTours / parsedLimit),
            })
        } catch (error) {
            next(error)
        }
    }

    async getTourById(req, res, next) {
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
            const updatedTour = await tourModel.findByIdAndUpdate(
                id, req.body,
                { new: true })
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
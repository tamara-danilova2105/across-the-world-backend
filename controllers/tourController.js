const tourModel = require('../models/tour-model');
const { updateFile } = require('../services/uploadService');
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

            const { limit , page } = req.params;
            const parsedLimit = parseInt(limit)
            const parsedPage = parseInt(page)

            const tours = await tourModel.find(filters)
                .sort(sorting)
                .skip((parsedPage - 1) * parsedLimit)
                .limit(Number(parsedLimit))
            
            if (tours.length === 0) {
                return res.status(200).json({ message: 'Туры не найдены' });
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
            const { updatedDate } = req.body
            const tour = await tourModel.findById(id)

            const coverImages = tour.imageCover.map(img => img.src);
            const programImages = tour.program.flatMap(day => day.images.map(img => img.src))
            const hotelImages = tour.hotels.map(img => img.src);

            const coverImagesUpdate = updatedTour.imageCover.map(img => img.src);
            const programImagesUpdate = updatedTour.program.flatMap(day => day.images.map(img => img.src))
            const hotelImagesUpdate = updatedTour.hotels.map(img => img.src);

            if (coverImages && coverImagesUpdate && coverImages !== coverImagesUpdate) {
                await updateFile(coverImages)
            } else if (programImages && programImagesUpdate && programImages !== programImagesUpdate) {
                await updateFile(programImages)
            } else if (hotelImages && hotelImagesUpdate && hotelImages !== hotelImagesUpdate) {
                await updateFile(hotelImages)
            }

            const updatedTour = await tourModel.findByIdAndUpdate(
                id, { updatedDate },
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
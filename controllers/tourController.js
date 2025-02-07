const tourModel = require('../models/tour-model')
const { buildFilterQuery } = require('../utils/buildFilterQuery')
const { buildSortQuery } = require('../utils/buildSortQuery')

class TourController {
    async getAllTours(req, res, next) {
        try {
            const { sort, filter, admin = "false", limit = "10", page = "1" } = req.query;

            const parsedSort = sort ? JSON.parse(sort) : {};
            const sorting = buildSortQuery(parsedSort);

            const parsedFilter = filter ? JSON.parse(filter) : {};
            const filters = buildFilterQuery(parsedFilter);

            console.log(sort, filter);

            const parsedLimit = parseInt(limit, 10) || 10;
            const parsedPage = parseInt(page, 10) || 1;

            // Если `admin !== "true"`, фильтруем только опубликованные туры
            if (admin !== "true") {
                filters.isPublished = true;
            }

            const tours = await tourModel.find(filters)
                .sort(sorting)
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit);

            if (tours.length === 0) {
                return res.status(404).json({ message: "Туры не найдены" });
            }

            const allTours = await tourModel.countDocuments(filters);

            res.status(200).json({
                tours,
                allTours,
                currentPage: parsedPage,
                totalPages: Math.ceil(allTours / parsedLimit),
            });
        } catch (error) {
            next(error);
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
                hotels,
                isPublished,
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
                hotels,
                isPublished,
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

    async updateTourDetails(req, res, next) {
        try {
            const { id } = req.params;
            const { dates, isPublished } = req.body;

            const updateFields = {};
            if (dates) updateFields.dates = dates;
            if (typeof isPublished === "boolean") updateFields.isPublished = isPublished;

            const updatedTour = await tourModel.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true }
            );

            if (!updatedTour) {
                return res.status(404).json({ message: "Тур не найден" });
            }

            res.status(200).json(updatedTour);
        } catch (error) {
            next(error);
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

module.exports = new TourController();
const ReviewModel = require('../models/reviews-model');

class ReviewController {
    async getReviews(req, res, next) {
        try {
            //reviews?isModeration=false
            //1) отображать в админке - только те отзывы, где isModeration === false
            //reviews
            //2) отображать на странице отзывы все отзывы, которые имею статус isModeration === true
            //reviews?isModeration=false&tourId=123
            //3) отображать на странице туров отзывы, которые относятся к этому туру

            const { isModeration, tourId, limit = 10, offset = 0 } = req.query;

            const filter = {};

            if (isModeration === 'false') {
                filter.isModeration = false;
            } else {
                filter.isModeration = true;
            }

            if (tourId) {
                filter.tourId = tourId;
            }

            const parsedLimit = Math.max(1, parseInt(limit, 10)) || 10;
            const parsedOffset = Math.max(0, parseInt(offset, 10)) || 0;

            const reviews = await ReviewModel.find(filter)
                .skip(parsedOffset)
                .limit(parsedLimit)
                .lean();

            const totalReviews = await ReviewModel.countDocuments(filter);

            return res.status(200).json({
                total: totalReviews,
                limit: parsedLimit,
                offset: parsedOffset,
                reviews,
            });
        } catch (e) {
            next(e);
        }
    }

    async addReview(req, res, next) {
        try {
            const {
                name,
                city,
                feedback,
                tourId,
            } = req.body

            const newReview = new ReviewModel({
                name,
                city,
                feedback,
                tourId,
                isModeration: false
            })

            const savedReview = await newReview.save()

            res.status(200).json({
                message: 'Отзыв добавлен и ожидает модерации',
                savedReview
            })
        } catch (e) {
            next(e)
        }
    }

    async moderateReview(req, res, next) {
        try {
            const { id } = req.params;
            const { isModeration } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'id не указан' });
            }

            if (isModeration !== true) {
                return res.status(400).json({ message: 'Неверное значение isModeration' });
            }

            const updatedReview = await ReviewModel.findByIdAndUpdate(
                id,
                { isModeration },
                { new: true }
            )

            if (!updatedReview) {
                return res.status(404).json({ message: 'Отзыв не найден' })
            }

            res.status(200).json({
                message: 'Отзыв одобрен и опубликован',
                updatedReview
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteReview(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'id не указан' })
            }

            const deletedReview = await ReviewModel.findByIdAndDelete(id)

            if (!deletedReview) {
                return res.status(404).json({ message: 'Отзыв не найден' })
            }

            res.status(200).json({
                message: 'Отзыв удален',
                review: deletedReview
            });
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ReviewController()
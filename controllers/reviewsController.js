const ReviewModel = require('../models/review-model');

class ReviewController {
    async getReviews(req, res, next) {
        try {
            const { isAuth } = req.query;
            
            if (isAuth === 'true') {
                const [moderatedReviews, unmoderatedReviews] = await Promise.all([
                    ReviewModel.find({ isModeration: true }),
                    ReviewModel.find({ isModeration: false })
                ])

                return res.status(200).json({
                    moderatedReviews,
                    unmoderatedReviews
                })
            } else {
                const moderatedReviews = await ReviewModel.find({ isModeration: true })
                
                if (moderatedReviews.length === 0) {
                    return res.status(404).json({ message: 'Отзывы не найдены' })
                }

                return res.status(200).json(moderatedReviews)
            }
        } catch (e) {
            next(e)
        }
    }

    async addReview(req, res, next) {
        try {
            const { 
                name,
                city, 
                direction, 
                review } = req.body

            const newReview = new ReviewModel({
                name,
                city,
                direction,
                review,
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

    async updateReview(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'ID не указан' });
            }

            const updatedReview = await ReviewModel.findByIdAndUpdate(
                id, req.body,
                { new: true })

            if (!updatedReview) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            const message = req.body.hasOwnProperty('isModeration')
            ? req.body.isModeration
                ? 'Отзыв одобрен и опубликован'
                : 'Отзыв снят с публикации'
            : 'Отзыв обновлен';;

            res.status(200).json({
                message,
                updatedReview
            });
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

            const updatedReview = await ReviewModel.findByIdAndUpdate(
                id,
                { isModeration },
                { new: true }
            )

            if (!updatedReview) {
                return res.status(404).json({ message: 'Отзыв не найден' })
            }

            res.status(200).json({
                message: isModeration ? 'Отзыв одобрен и опубликован' : 'Отзыв снят с публикации',
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
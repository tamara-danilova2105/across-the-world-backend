const express = require('express');
const { body } = require('express-validator');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const router = express.Router()
const {
    registration,
    login,
    logout,
    resetPassword,
    refreshPassword,
    refresh
} = require('./controllers/authController');
const {
    getAllTours,
    getTourById,
    addTour,
    editTour,
    deleteTour
} = require('./controllers/tourController');
const {
    getAllBlogs,
    getBlog,
    addBlog,
    editBlog,
    deleteBlog,
    blog
} = require('./controllers/blogController');
const {
    getRegions,
    addNewRegion,
    deleteRegion,
} = require('./controllers/regionController');
const {
    getReviews,
    addReview,
    moderateReview,
    deleteReview
} = require('./controllers/reviewsController');
const {
    getTimer,
    addNewTimer,
    editTimer,
    deleteTimer
} = require('./controllers/timerController');

const createStorage = require('./middleware/uploadMiddleware');
const uploadNews = createStorage('uploads/news');

router.post('/registration',
    [
        body('login').notEmpty().withMessage('Логин обязателен'),
        body('email').isEmail().withMessage('Некорректный email'),
        body('password').isLength({ min: 5 }).withMessage('Пароль должен быть минимум 5 символов')
    ],
    registration
)
router.post('/login',
    [
        body('login').notEmpty().withMessage('Логин обязателен'),
        body('password').notEmpty().withMessage('Пароль обязателен')
    ],
    login
)
router.delete('/logout', logout)
router.post('/reset-password',
    [
        body('email').isEmail().withMessage('Некорректный email')
    ],
    resetPassword
)
router.put('/refresh-password',
    [
        body('resetToken').notEmpty().withMessage('Токен обязателен'),
        body('newPassword').isLength({ min: 5 }).withMessage('Пароль должен быть минимум 5 символов')
    ],
    refreshPassword
)
router.put('/refresh', refresh)

router.get('/tours/:limit/:page', getAllTours)
router.get('/tours/:id', getTourById)
router.post('/tours', addTour)
router.put('/tours/:id', editTour)
router.delete('/tours/:id', deleteTour)

router.get('/news', getAllBlogs);
router.get('/news/:id', getBlog);
router.post('/news', uploadNews.array('images', 4), addBlog);
router.put('/news/:id', editBlog);
router.delete('/news/:id', deleteBlog);

router.get('/regions', getRegions);
router.post('/regions', addNewRegion);
router.delete('/regions/:region', deleteRegion);

router.get('/reviews', getReviews)
router.post('/reviews', addReview)
router.put('/reviews/:id', moderateReview)
router.delete('/reviews/:id', deleteReview)

router.get('/timer', getTimer)
router.post('/timer', addNewTimer)
router.put('/timer/:id', editTimer)
router.delete('/timer/:id', deleteTimer)

router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument))

// Конфигурация для разных типов загрузок


//другие примеры:
// const uploadProducts = createStorage('uploads/products');
// const uploadProfiles = createStorage('uploads/profiles');
// пример для обновления одного изображение
// router.post('/profile', uploadProfiles.single('avatar'), updateProfile);

module.exports = router
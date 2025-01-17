const express = require('express');
const { body } = require('express-validator');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const router = express.Router()
const { registration, 
    login, 
    logout, 
    resetPassword, 
    refreshPassword, 
    refresh } = require('./controllers/authController');
const { getAllTours,
    getTour, 
    addTour, 
    editTour, 
    deleteTour } = require('./controllers/tourController');

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


router.get('/get-all-tours', getAllTours)
router.get('/get-tour/:id', getTour)
router.post('/add-tour', addTour)
router.put('/edit-tour/:id', editTour)
router.delete('/delete-tour/:id', deleteTour)

router.put('/refresh', refresh)
router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument))

module.exports = router
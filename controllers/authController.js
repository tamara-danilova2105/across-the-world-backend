const AuthService = require('../services/authService');
const { validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorMidleware')

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest('Ошибка при регистрации!', errors.array())
            }
            
            const { login, password, email } = req.body
            const adminData = await AuthService.registration(login, password, email)
            res.cookie('refreshToken', adminData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            return res.json(adminData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { login, password } = req.body
            const adminData = await AuthService.login(login, password)
            res.cookie('refreshToken', adminData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            return res.json(adminData)
        } catch (e) {
            console.log(e)
            next(ApiError.BadRequest('Ошибка входа')) 
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken') 
            return res.json(token)
        } catch (e) {
            next(ApiError.BadRequest('Ошибка выхода'))
        } 
    }

    async resetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const response = await AuthService.resetPassword(email)
            return res.json(response) 
        } catch (e) {
            next(ApiError.BadRequest('Ошибка сброса пароля'))
        }
    }

    async refreshPassword(req, res, next) {
        try {
            const { resetToken, newPassword } = req.body
            const adminData = await AuthService.refreshPassword(resetToken, newPassword)
            return res.json(adminData)
        } catch (e) {
            next(ApiError.BadRequest('Ошибка обновления пароля'))
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const adminData = await AuthService.refresh(refreshToken)
            res.cookie('refreshToken', adminData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            return res.json(adminData)
        } catch (e) {
            next(ApiError.BadRequest('Ошибка обновления токена!'))
        }
    }
}

module.exports = new AuthController()
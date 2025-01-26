const adminModel = require('../models/admin-model');
const bcrypt = require('bcryptjs');
const TokenService = require('./tokenService');
const MailService = require('./mailService');
const { ApiError } = require('../middleware/errorMidleware')

class AuthService {
    async registration(login, password, email) {
        const candidate = await adminModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest('Админ с таким email уже существует!')
        }
        
        const hashPassword = bcrypt.hashSync(password, 7)
        const admin = await adminModel.create({ login, password: hashPassword, email })

        const token = TokenService.generateTokens({ id: admin._id.toString() })
        await TokenService.saveToken(admin._id, token.refreshToken)

        return { message: "Админ успешно зарегистрирован!" }
    }

    async login(login, password) {
        const admin = await adminModel.findOne({ login })
        if (!admin) {
            throw ApiError.BadRequest('Login или пароль не верен!')
        }

        const passEquals = bcrypt.compareSync(password, admin.password)
        if (!passEquals) {
            throw ApiError.BadRequest('Login или пароль не верен!')
        }

        const token = TokenService.generateTokens({ id: admin._id.toString() })
        await TokenService.saveToken(admin._id, token.refreshToken)

        return ({ admin, token })
    }

    async logout(refreshToken) {
        const admin_token = await TokenService.removeToken(refreshToken)
        return admin_token
    }

    async resetPassword(email) {
        const admin = await adminModel.findOne({ email })
        if (!admin) {
            throw ApiError.NotFound('Админ с таким email не найден!')
        }

        const resetToken = TokenService.resetToken(email) 
        await MailService.sendResetPasswordEmail(email, resetToken)
        return { resetToken, message: "Инструкция для смены пароля отправлена на почту" }
    }

    async refreshPassword(resetToken, newPassword) {
        try {
            const email = TokenService.decodedEmail(resetToken)
            const admin = await adminModel.findOne({ email })
            if (!admin) {
                throw ApiError.NotFound('Админ не найден')
            }

            const hashPassword = bcrypt.hashSync(newPassword, 7)
            admin.password = hashPassword;
            await admin.save();
            return { message: "Пароль успешно изменен!" }
        } catch (error) {
            throw ApiError.BadRequest('Недействительный или просроченный токен!')
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }
        const adminData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = TokenService.findToken(refreshToken)
        if (!adminData || !tokenFromDB) {
            throw ApiError.Unauthorized()
        }

        const admin = await adminModel.findById(adminData._id)
        const tokens = TokenService.generateTokens({ id: admin._id.toString() })
        await TokenService.saveToken(admin._id, tokens.refreshToken)
        return { ...tokens, admin }
    }
}

module.exports = new AuthService()
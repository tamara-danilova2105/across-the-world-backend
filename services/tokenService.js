const jwt = require('jsonwebtoken')
const Token = require('../models/token-model')
require('dotenv').config();

class TokenService{
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return user;
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return user;
        } catch (e) {
            return null;
        }
    }

    resetToken = (email) => {
        const payload = { email }
        return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: "5m" });
    }

    decodedEmail = (resetToken) => {
        const decoded = jwt.verify(resetToken, process.env.JWT_TOKEN_SECRET)
        return decoded.email
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }
        const token = await Token.create({ user: userId, refreshToken})
        return token;
    }

    async findToken(refreshToken) {
        const token = await Token.findOne({refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const token = await Token.deleteOne({refreshToken})
        return token;
    }
}

module.exports = new TokenService()
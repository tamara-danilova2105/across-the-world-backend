const nodemailer = require('nodemailer');
require('dotenv').config()
const {resetPasswordTemplate} = require('../templates/resetPassword-template')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_ADMIN,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendResetPasswordEmail(email, resetToken) {
        await this.transporter.sendMail({
            from: process.env.SMTP_ADMIN,
            to: email,
            subject: `Восстановление пароля`,
            html: resetPasswordTemplate(resetToken)
        })
    }

    async sendUserEmail(email) {
        await this.transporter.sendMail({
            from: process.env.SMTP_ADMIN,
            to: email,
            subject: `Подписка на новости`,
            html: userTemplate(email)
        })
    }

    async sendAdminEmail(email) {
        await this.transporter.sendMail({
            from: process.env.SMTP_ADMIN,
            to: process.env.SMTP_ADMIN,
            subject: `Новый подписчик`,
            html: adminTemplate(email)
        })
    }
}

module.exports = new MailService()
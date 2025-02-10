const MailService = require('../services/mailService');

class SubscribeController {
    async sendMessage(req, res, next) {
        try {
            const { email } = req.body
            await Promise.all([
                MailService.sendUserEmail(email),
                MailService.sendAdminEmail(email)
            ])

            res.status(200).json({
                success: true,
                message: 'Подписка успешно оформлена' 
            })
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new SubscribeController()

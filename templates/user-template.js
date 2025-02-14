const userTemplate = (email) => 
    `<!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8"> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222f52; margin: 0; padding: 0; background-color: rgba(34, 47, 82, 0.1);">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);">
            <div style="background-color: #222f52; color: #FFFFFF; padding: 24px; text-align: center; border-radius: 16px 16px 0 0;">
                <h1 style="margin: 0; font-family: Arial, sans-serif;">Спасибо за подписку!</h1>
            </div>
            <div style="padding: 24px; background-color: #FFFFFF; border: 1px solid rgba(34, 47, 82, 0.2); border-radius: 0 0 16px 16px;">
                <p>Здравствуйте, ${email}!</p>
                
                <p>Благодарим вас за подписку на наши новости! Мы рады приветствовать вас в нашем сообществе путешественников.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <h2 style="color: #e08478; margin-top: 0;">Как получить скидку?</h2>
                    <p>Чтобы воспользоваться персональной скидкой 3% на все туры, выполните два простых шага:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
                            <span style="color: #e08478; position: absolute; left: 0;">✓</span>
                            Подпишитесь на нас в соцсетях:
                            <ul style="list-style: none; padding-left: 24px; margin-top: 5px;">
                                <li><a href="https://t.me/acrosstheworldru" style="color: #e08478; text-decoration: none;">Telegram</a></li>
                                <li><a href="https://www.instagram.com/acrosstheworld.ru" style="color: #e08478; text-decoration: none;">Instagram</a></li>
                                <li><a href="https://vk.com/acrosstheworld_ru" style="color: #e08478; text-decoration: none;">ВКонтакте</a></li>
                            </ul>
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
                            <span style="color: #e08478; position: absolute; left: 0;">✓</span>
                            Сообщите нам ответным письмом, что подписка оформлена
                        </li>
                    </ul>
                </div>
                
                <p>После проверки вашей подписки скидка 3% будет учтена при оплате тура.</p>
                
                <div style="text-align: center; margin: 32px 0;">
                    <a href="http://localhost:3000" 
                    style="display: inline-block; padding: 12px 24px; background-color: #e08478; color: #FFFFFF; text-decoration: none; border-radius: 16px; font-family: Arial, sans-serif; text-shadow: 2px 2px 4px rgba(34, 47, 82, 0.4);">
                        Исследовать туры
                    </a>
                </div>
                
                <p style="color: #666;">С наилучшими пожеланиями,<br>Ваша команда путешествий</p>
            </div>
        </div>
    </body>
    </html>
    `
    module.exports = { userTemplate }
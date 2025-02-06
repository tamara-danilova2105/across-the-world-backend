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
                <h2 style="color: #e08478; margin-top: 0;">Ваши преимущества:</h2>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
                        <span style="color: #e08478; position: absolute; left: 0;">✓</span>
                        Скидка 3% на все туры
                    </li>
                    <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
                        <span style="color: #e08478; position: absolute; left: 0;">✓</span>
                        Первыми узнаете о новых направлениях
                    </li>
                    <li style="margin-bottom: 10px; padding-left: 24px; position: relative;">
                        <span style="color: #e08478; position: absolute; left: 0;">✓</span>
                        Эксклюзивные предложения
                    </li>
                </ul>
            </div>
            
            <p>Ваша персональная скидка 3% будет учтена при оплате тура.</p>
            
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
module.exports = { userTemplate };
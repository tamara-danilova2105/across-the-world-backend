const adminTemplate = (email) => `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222f52; margin: 0; padding: 0; background-color: rgba(34, 47, 82, 0.1);">
    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);">
        <div style="background-color: #222f52; color: #FFFFFF; padding: 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; font-family: Arial, sans-serif;">Новый подписчик!</h1>
        </div>
        <div style="padding: 24px; background-color: #FFFFFF; border: 1px solid rgba(34, 47, 82, 0.2); border-radius: 0 0 16px 16px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <h2 style="color: #222f52; margin-top: 0; font-size: 18px;">Информация о подписчике:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Email:</td>
                        <td style="padding: 8px 0; font-weight: 600;">${email}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background-color: #e8f5e9; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
                <p style="margin: 0; color: #2e7d32;">
                    ✓ Подписчику предоставлена скидка 3% на все туры
                </p>
            </div>
        </div>
        <div style="margin-top: 24px; text-align: center; color: rgba(34, 47, 82, 0.6); font-size: 14px; padding-bottom: 24px;">
            <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
`

module.exports = { adminTemplate }; 
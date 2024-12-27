const resetPasswordTemplate = (resetToken) => `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222f52; margin: 0; padding: 0; background-color: rgba(34, 47, 82, 0.1);">
    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;  border-radius: 16px; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);">
        <div style="background-color: #222f52; color: #FFFFFF; padding: 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; font-family: Arial, sans-serif;">Восстановление пароля</h1>
        </div>
        <div style="padding: 24px; background-color: #FFFFFF; border: 1px solid rgba(34, 47, 82, 0.2); border-radius: 0 0 16px 16px;">
            <p>Здравствуйте!</p>
            
            <p>Вы получили это письмо, потому что был запрошен сброс пароля для вашей учетной записи.</p>
            
            <p>Для восстановления пароля нажмите на кнопку ниже:</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:3000/refresh-password/${resetToken}" 
                style="display: inline-block; padding: 12px 24px; background-color: #e08478; color: #FFFFFF; text-decoration: none; border-radius: 16px; margin: 20px 0; font-family: Arial, sans-serif; text-shadow: 2px 2px 4px rgba(34, 47, 82, 0.4);">
                    Сменить пароль
                </a>
            </div>
            
            <p><span style="color: #e08478; font-weight: 600;">Важно:</span> Ссылка действительна в течение ограниченного времени.</p>
            
            <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. Ваш пароль останется неизменным.</p>
        </div>
        <div style="margin-top: 24px; text-align: center; color: rgba(34, 47, 82, 0.6); font-size: 14px;">
            <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = { resetPasswordTemplate };
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const saveFile = async (file) => {
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Изменение расширения файла на .webp
    const optimizedFileName = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
    const optimizedFilePath = path.join(uploadDir, optimizedFileName);

    try {
        // Сжатие и конвертация в WebP
        await sharp(file.path)
            .webp({ quality: 75 }) // Сжатие с качеством 75%
            .toFile(optimizedFilePath);

        fs.unlinkSync(file.path); // Удаление оригинального (большого) файла

        return `/uploads/${optimizedFileName}`; // Возвращение пути к оптимизированному файлу
    } catch (error) {
        console.error('Ошибка оптимизации изображения:', error);
        throw new Error('Ошибка при обработке изображения.'); 
    }
}

module.exports = { saveFile }





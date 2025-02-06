const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Функция для создания хранилища с динамическим путем
const createStorage = (folder = 'uploads') => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, `../${folder}`);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        }
    });

    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|webp|gif/;
            const isValid = allowedTypes.test(file.mimetype);
            isValid ? cb(null, true) : cb(new Error('Неверный тип файла.'));
        }
    });
};

module.exports = createStorage;



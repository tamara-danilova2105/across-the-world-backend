const multer = require('multer');
const path = require('path');

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Фильтрация типов файлов
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(file.mimetype);
    isValid ? cb(null, true) : cb(new Error('Неверный тип файла.'));
};

// Конфигурация для загрузки нескольких файлов
const upload = multer({ storage, fileFilter });

module.exports = upload;


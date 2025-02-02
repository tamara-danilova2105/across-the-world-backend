const uploadService = require('../services/uploadService');

const uploadPhotos = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Файлы не были загружены.' });
        }

        const filePaths = files.map(file => uploadService.saveFile(file)); // Сохраняем каждый файл
        res.status(200).json({ message: 'Файлы успешно загружены.', files: filePaths });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка загрузки.', error: error.message });
    }
};

module.exports = { uploadPhotos };


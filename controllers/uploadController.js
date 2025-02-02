const uploadService = require('../services/uploadService');

//TODO - если не нужен будет, надо удалить
//загрузка фотографий без привязки к созданию новостей или других сущностей
// router.post('/upload', upload.array('photos', 5), uploadPhotos);

const uploadPhotos = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Файлы не были загружены.' });
        }

        // Ожидаем завершения загрузки всех файлов
        const filePaths = await Promise.all(files.map(file => uploadService.saveFile(file)));

        res.status(200).json({
            message: 'Файлы успешно загружены.',
            files: filePaths
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка загрузки.', error: error.message });
    }
};

module.exports = { uploadPhotos };



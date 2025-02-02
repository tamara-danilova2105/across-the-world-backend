// const multer = require('multer');
// const path = require('path');
// const fs = require('fs').promises;
// const express = require('express');
// const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (_, _, cb) {
//         cb(null, 'upload/');
//     },
//     filename: function (_, file, cb) {
//         cb(null, file.originalname);
//     }
// })

// const upload = multer({storage})

// router.post('/upload', upload.single('image'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'Файл не найден' });
//     }
//     res.json({
//         success: true,
//         path: `/upload/${req.file.filename}`
//     })
// })

// const updateFile = async (oldFilePath) => {
//     try {
//         if (oldFilePath) {
//             if (fs.existsSync(oldImagePath)) {
//                 fs.unlink(oldImagePath, err => {
//                     if (err) {
//                         return res.status(500).send({ error: err.message });
//                     }
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Ошибка при обновлении файла:', error);
//         throw error;
//     }
// };

// const deleteFile = async (filename) => {
//     try {
//         const filepath = path.join(__dirname, '..', 'uploads', filename);
//         await fs.unlink(filepath);
//         return true;
//     } catch (error) {
//         console.error('Ошибка при удалении:', error);
//         return false;
//     }
// };

// module.exports = {
//     router,
//     updateFile,
//     deleteFile
// }
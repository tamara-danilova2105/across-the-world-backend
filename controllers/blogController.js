const NewsBlogModel = require('../models/blog-model');
const { saveFile } = require('../services/uploadService');
const path = require('path');
const fs = require('fs');

class BlogController {
    async getAllBlogs(req, res, next) {
        try {
            const { limit, page } = req.query;

            const parsedLimit = parseInt(limit);
            const parsedPage = parseInt(page);

            const totalBlogs = await NewsBlogModel.countDocuments();

            const blogs = await NewsBlogModel.find()
                .sort({ createdAt: -1 })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(Number(parsedLimit))

            res.status(200).json({
                blogs,
                currentPage: parsedPage,
                totalPages: Math.ceil(totalBlogs / parsedLimit),
            })
        } catch (e) {
            next(e)
        }
    }

    async getBlog(req, res, next) {
        try {
            const { id } = req.params
            const blog = await NewsBlogModel.findById(id)

            if (!blog) {
                return res.status(404).json({ message: 'Новость не найдена' })
            }

            res.status(200).json(blog)
        } catch (e) {
            next(e)
        }
    }

    async addBlog(req, res, next) {
        try {
            const { title, description } = req.body;
            const files = req.files

            const photos = await Promise.all(files.map(async (file) => {
                const optimizedSrc = await saveFile(file);
                return { _id: crypto.randomUUID(), src: optimizedSrc };
            }));

            const newBlog = new NewsBlogModel({ title, description, photos });
            const savedBlog = await newBlog.save();

            res.status(200).json({ message: 'Новость добавлена', blog: savedBlog });
        } catch (error) {
            next(error)
        }
    }

    async editBlog(req, res, next) {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(400).json({ message: 'ID новости не указан' })
            }

            const updatedBlog = await NewsBlogModel.findByIdAndUpdate(
                id, req.body,
                { new: true })

            if (!updatedBlog) {
                return res.status(404).json({ message: 'Блог не найден' })
            }
            res.status(200).json({ message: 'Новость обновлена', updatedBlog })
        } catch (e) {
            next(e)
        }
    }

    async deleteBlog(req, res, next) {
        try {
            const { id } = req.params;
            const deletedBlog = await NewsBlogModel.findByIdAndDelete(id);

            console.log(deletedBlog);
            

            if (!deletedBlog) {
                return res.status(404).json({ message: 'Блог не найден' });
            }

            // Удаление связанных изображений
            if (deletedBlog.photos && deletedBlog.photos.length > 0) {
                deletedBlog.photos.forEach(({ src }) => {
                    const fullPath = path.join(__dirname, '..', src);
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.error(`Ошибка при удалении файла: ${fullPath}`, err);
                        } else {
                            console.log(`Файл успешно удален: ${fullPath}`);
                        }
                    });
                });
            }
    

            res.status(200).json({ message: 'Блог и связанные изображения удалены', deletedBlog });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BlogController()
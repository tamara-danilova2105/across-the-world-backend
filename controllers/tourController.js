const tourModel = require('../models/tour-model');
const { buildFilterQuery, filterToursByDuration } = require('../utils/buildFilterQuery');
const { buildSortQuery } = require('../utils/buildSortQuery');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const deleteFiles = async (images) => {
    if (!images || images.length === 0) return;

    await Promise.all(
        images.map(async (imageName) => {
            if (!imageName) return;

            const decodedImageName = decodeURIComponent(imageName);
            const imagePath = path.join(__dirname, '..', 'uploads', decodedImageName);

            try {
                await fs.promises.unlink(imagePath);
                console.log(`Удален файл: ${imagePath}`);
            } catch (err) {
                console.error(`Ошибка удаления файла ${imagePath}:`, err.message);
            }
        })
    );
};

class TourController {
    async getAllTours(req, res, next) {
        try {
            const { sort, filter, admin = "false", limit = "10", page = "1" } = req.query;
            console.log(filter)

            const parsedSort = sort ? JSON.parse(sort) : {};
            const sorting = buildSortQuery(parsedSort);

            const parsedFilter = filter ? JSON.parse(filter) : {};
            const filters = buildFilterQuery(parsedFilter);

            const parsedLimit = parseInt(limit, 10) || 10;
            const parsedPage = parseInt(page, 10) || 1;

            // Если `admin !== "true"`, фильтруем только опубликованные туры
            if (admin !== "true") {
                filters.isPublished = true;
            }

            let tours = await tourModel.find(filters)
                .sort(sorting)
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit);


            tours = filterToursByDuration(tours, parsedFilter.duration);

            const allTours = await tourModel.countDocuments(filters);

            res.status(200).json({
                tours,
                allTours,
                currentPage: parsedPage,
                totalPages: Math.ceil(allTours / parsedLimit),
            });
        } catch (error) {
            next(error);
        }
    }

    async getTourList(_, res, next) {
        try {
            const tourList = await tourModel.find({}, "_id tour");

            res.status(200).json(tourList);
        } catch (error) {
            next(error);
        }
    }

    async getTourById(req, res, next) {
        try {
            const { id } = req.params;
            const tour = await tourModel.findById(id)
            if (!tour) {
                return res.status(404).json({ message: 'Тур не найден' })
            }
            res.status(200).json(tour)
        } catch (error) {
            next(error)
        }
    }

    async addTour(req, res, next) {
        try {
            const cleanedData = JSON.parse(JSON.stringify(req.body));

            cleanedData.dates = cleanedData.dates.map(date => ({
                ...date,
                spots: date.spots !== undefined ? Number(date.spots) : Number(date.spotsTotal),
                spotsTotal: Number(date.spotsTotal),
                price: {
                    ...date.price,
                    amount: Number(date.price.amount)
                }
            }));

            const newTour = new tourModel(cleanedData);
            const savedTour = await newTour.save();

            res.status(200).json(savedTour);
        } catch (error) {
            console.error("Ошибка при сохранении тура:", error);
            next(error);
        }
    }


    async editTour(req, res, next) {
        try {
            const { id } = req.params;
            const { deletedImages, ...updateData } = req.body;

            if (Array.isArray(deletedImages) && deletedImages.length > 0) {
                await deleteFiles(deletedImages);
            }

            const updatedTour = await tourModel.findByIdAndUpdate(id, updateData, { new: true });

            if (!updatedTour) {
                return res.status(404).json({ message: 'Тур не найден' });
            }

            res.status(200).json(updatedTour);
        } catch (error) {
            next(error);
        }
    }

    async updateTourDetails(req, res, next) {
        try {
            const { id } = req.params;
            const { dates, isPublished, imageCover, hotels, program } = req.body;
    
            const tour = await tourModel.findById(id);
    
            if (!tour) {
                return res.status(404).json({ message: "Тур не найден" });
            }
    
            const cleanPath = (src) => src.replace(/^\/?uploads\//, "");
    
            // Получаем текущие изображения до обновления
            const oldImages = {
                imageCover: tour.imageCover.map(img => cleanPath(img.src)),
                hotels: tour.hotels.map(img => cleanPath(img.src)),
                program: tour.program.flatMap(day => day.images.map(img => cleanPath(img.src))),
            };
    
            // Получаем новые изображения из тела запроса (если они переданы)
            const newImages = {
                imageCover: imageCover ? imageCover.map(img => cleanPath(img.src)) : oldImages.imageCover,
                hotels: hotels ? hotels.map(img => cleanPath(img.src)) : oldImages.hotels,
                program: program ? program.flatMap(day => day.images.map(img => cleanPath(img.src))) : oldImages.program,
            };
    
            // Определяем, какие изображения удалены
            const deletedImages = [
                ...oldImages.imageCover.filter(img => !newImages.imageCover.includes(img)),
                ...oldImages.hotels.filter(img => !newImages.hotels.includes(img)),
                ...oldImages.program.filter(img => !newImages.program.includes(img))
            ];
    
            if (deletedImages.length > 0) {
                // Проверяем, используются ли удаленные изображения в других турах
                const toursUsingImages = await tourModel.find({
                    _id: { $ne: id },
                    $or: [
                        { "imageCover.src": { $in: deletedImages.map(img => `/uploads/${img}`) } },
                        { "hotels.src": { $in: deletedImages.map(img => `/uploads/${img}`) } },
                        { "program.images.src": { $in: deletedImages.map(img => `/uploads/${img}`) } },
                    ],
                });
    
                // Оставляем только изображения, которые больше нигде не используются
                const imagesToDelete = deletedImages.filter(img =>
                    !toursUsingImages.some(tour =>
                        tour.imageCover.some(i => cleanPath(i.src) === img) ||
                        tour.hotels.some(i => cleanPath(i.src) === img) ||
                        tour.program.some(programItem =>
                            programItem.images.some(i => cleanPath(i.src) === img)
                        )
                    )
                );
    
                if (imagesToDelete.length > 0) {
                    await deleteFiles(imagesToDelete);
                }
            }
    
            // Обновляем тур
            const updateFields = {};
            if (dates) updateFields.dates = dates;
            if (typeof isPublished === "boolean") updateFields.isPublished = isPublished;
            if (imageCover) updateFields.imageCover = imageCover;
            if (hotels) updateFields.hotels = hotels;
            if (program) updateFields.program = program;
    
            const updatedTour = await tourModel.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true }
            );
    
            res.status(200).json(updatedTour);
        } catch (error) {
            next(error);
        }
    }

    async deleteTour(req, res, next) {
        try {
            const { id } = req.params;
            const tour = await tourModel.findById(id);

            if (!tour) {
                return res.status(404).json({ message: 'Тур не найден' });
            }

            const cleanPath = (src) => src.replace(/^\/?uploads\//, "");

            // все изображения тура
            const imageCoverFiles = tour.imageCover.map(img => cleanPath(img.src));
            const hotelFiles = tour.hotels.map(img => cleanPath(img.src));
            const programImages = tour.program.flatMap(programItem =>
                programItem.images.map(img => cleanPath(img.src))
            );

            const allImages = [...imageCoverFiles, ...hotelFiles, ...programImages];

            // туры, в которых используются эти же изображения
            const toursUsingImages = await tourModel.find({
                _id: { $ne: id }, // Исключаем текущий тур
                $or: [
                    { "imageCover.src": { $in: allImages.map(img => `/uploads/${img}`) } },
                    { "hotels.src": { $in: allImages.map(img => `/uploads/${img}`) } },
                    { "program.images.src": { $in: allImages.map(img => `/uploads/${img}`) } },
                ],
            });

            //список изображений, которые НЕ используются в других турах
            const imagesToDelete = allImages.filter(img =>
                !toursUsingImages.some(tour =>
                    tour.imageCover.some(i => cleanPath(i.src) === img) ||
                    tour.hotels.some(i => cleanPath(i.src) === img) ||
                    tour.program.some(programItem =>
                        programItem.images.some(i => cleanPath(i.src) === img)
                    )
                )
            );

            await deleteFiles(imagesToDelete);

            await tourModel.findByIdAndDelete(id);

            res.status(200).json({ message: 'Тур и его изображения успешно удалены' });
        } catch (error) {
            next(error);
        }
    }

    async uploadFiles(req, res, next) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'Нет загруженных файлов' });
            }

            const uploadDir = path.join(__dirname, '../uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePromises = req.files.map(async (file) => {
                const fileId = path.parse(file.originalname).name;
                const filePath = path.join(uploadDir, `${fileId}.webp`)

                await sharp(file.buffer)
                    .webp({ quality: 75 })
                    .toFile(filePath);

                return { src: `/uploads/${fileId}.webp` };
            });

            const uploadedFiles = await Promise.all(filePromises);
            res.status(200).json({ message: 'Файлы загружены и сжаты', files: uploadedFiles });
        } catch (error) {
            console.error("Ошибка загрузки файлов:", error);
            next(error);
        }
    }
}

module.exports = new TourController();
const RegionModel = require('../models/region-model');

class RegionController {
    async getRegions(req, res, next) {
        try {
            const { search, direction } = req.query;

            let query = {};

            if (direction) {
                if (direction !== "Россия" && direction !== "Заграница") {
                    return res.status(400).json({ message: "Некорректное направление. Доступны: Россия, Заграница." });
                }
                query.direction = direction;
            }

            if (search) {
                query.region = new RegExp(`^${search}`, 'i');
            }

            const regions = await RegionModel.find(query).sort({ region: 1 });
            res.status(200).json(regions);
        } catch (e) {
            next(e);
        }
    }

    async getRegionsByDirection(req, res, next) {
        try {
            const { direction } = req.params;

            if (direction !== "Россия" && direction !== "Заграница") {
                return res.status(400).json({ message: "Некорректное направление. Доступны: Россия, Заграница." });
            }

            const regions = await RegionModel.find({ direction });

            res.status(200).json(regions);
        } catch (e) {
            next(e);
        }
    }

    async addNewRegion(req, res, next) {
        try {
            const {
                direction,
                region
            } = req.body

            const uniqueRegion = await RegionModel.findOne({ region });

            if (uniqueRegion) {
                return res.status(409).json({
                    message: 'Такой регион уже существует'
                })
            }

            const newRegion = new RegionModel({
                direction,
                region
            })

            const addNewRegion = await newRegion.save()
            res.status(200).json({ message: 'Регион добавлен', addNewRegion })
        } catch (e) {
            next(e)
        }
    }
    async deleteRegion(req, res, next) {
        try {
            const { region } = req.params

            const deletedRegion = await RegionModel.findByIdAndDelete(region)

            if (!deletedRegion) {
                res.status(404).json({ message: 'Регион не найден' })
            }

            res.status(200).json({ message: 'Регион удален', deletedRegion })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new RegionController()
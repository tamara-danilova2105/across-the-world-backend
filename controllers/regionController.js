const RegionModel = require('../models/region-model');

class RegionController {
    async getRegions(req, res, next) {
        try{
            const { direction } = req.query;

            const query = direction ? { direction } : {}
            const regions = await RegionModel.find(query)

            if (regions.length === 0) {
                return res.status(404).json({ message: 'Регионы не найдены' })
            }

            if (!direction) {
                const russianRegions = regions.filter(r => r.direction === 'Россия')
                const foreignRegions = regions.filter(r => r.direction === 'Заграница')

                return res.status(200).json({
                    regions,
                    russianRegions,
                    foreignRegions
                })
            }

            res.status(200).json(regions)
        } catch(e) {
            next(e)
        }
    }

    async addNewRegion(req, res, next) {
        try{
            const {
                direction,
                region
            } = req.body

            const uniqueRegion = await RegionModel.findOne({ region });

            if (uniqueRegion) {
                return res.status(409).json({ 
                    message: 'Такой регион уже существует' })
            }

            const newRegion = new RegionModel({
                direction,
                region
            })
            
            const addNewRegion = await newRegion.save()
            res.status(200).json({message:'Регион добавлен', addNewRegion})
        } catch(e) {
            next(e)
        }
    }
    async deleteRegion(req, res, next) {
        try{
            const { id } = req.params

            const deletedRegion = await RegionModel.findByIdAndDelete(id)

            if(!deletedRegion) {
                res.status(404).json({message: 'Регион не найден'})
            }

            res.status(200).json({ message: 'Регион удален', deletedRegion})
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new RegionController()
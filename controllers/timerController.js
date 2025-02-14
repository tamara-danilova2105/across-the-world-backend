const TimerModel = require('../models/timer-model')
const { saveFile } = require('../services/uploadService')

class TimerController {
    async getTimer(req, res, next) {
        try{
            const timer = await TimerModel.find()

            if(!timer || timer.length === 0) {
                res.status(200).json({
                    message: 'Таймер не найден',
                })
            }

        res.status(200).json(timer)
        } catch(e) {
            next(e)
        }
    }

    async addNewTimer(req, res, next) {
        try {
            const uniqueTimer = await TimerModel.findOne();
            if (uniqueTimer) {
                return res.status(409).json({
                    message: 'Таймер уже существует.'
                });
            }
    
            const { title, discount, region, timer, hide, imagesWithDetails } = req.body;
            const files = req.files;

            const parsedImagesWithDetails = JSON.parse(imagesWithDetails);
    
            const photos = await Promise.all(files.map(async (file) => {
                const optimizedSrc = await saveFile(file);
                return { _id: crypto.randomUUID(), src: optimizedSrc };
            }))
    
            const imagesWithDetail = parsedImagesWithDetails.map((detail, index) => ({
                _id: photos[index]._id,
                src: photos[index].src,
                header: detail.header,
                category: detail.category,
                describe: detail.describe 
            }));
    
            const newTimer = new TimerModel({
                title,
                discount,
                region,
                timer,
                hide,
                imagesWithDetails: imagesWithDetail
            });
    
            const savedTimer = await newTimer.save();

            console.log(savedTimer)
    
            res.status(200).json({ 
                message: 'Таймер добавлен', 
                timer: savedTimer 
            })
        } catch (e) {
            next(e)
        }
    }

    async editTimer(req, res, next) {
        try {
            const { id } = req.params;
            const { title, discount, region, hide, timer, imagesWithDetails } = req.body;
            const files = req.files;

            console.log(title, discount, region, hide, timer, imagesWithDetails)

            if (!id) {
                return res.status(400).json({ message: 'ID таймера не указан' });
            }
    
            const existingTimer = await TimerModel.findById(id);
            if (!existingTimer) {
                return res.status(404).json({ message: 'Таймер не найден' });
            }

            const newFiles = await Promise.all(files.map(async (file) => {
                const optimizedSrc = await saveFile(file);
                return { _id: crypto.randomUUID(), src: optimizedSrc };
            }));
    
            existingTimer.title = title;
            existingTimer.discount = discount;
            existingTimer.region = region;
            existingTimer.timer = timer;
            existingTimer.hide = hide;
            existingTimer.imagesWithDetails = JSON.parse(imagesWithDetails);
            existingTimer.files = [...(existingTimer.files || []), ...newFiles];
    
            const updatedTimer = await existingTimer.save();
    
            res.status(200).json({ message: 'Таймер обновлён', updatedTimer });
        } catch (error) {
            next(error);
        }
    }  

    async deleteTimer(req, res, next) {
        try {
            const deletedTimer = await TimerModel.findOneAndDelete()

            if (!deletedTimer) {
                return res.status(404).json({ message: 'Таймер не найден' })
            }

            res.status(200).json({ message: 'Таймер удалён', deletedTimer })
        } catch (e) {
            next(e)
        }
    } 
}

module.exports = new TimerController() 
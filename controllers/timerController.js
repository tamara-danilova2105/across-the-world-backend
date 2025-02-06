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

    // async addNewTimer(req, res, next) {
    //     try{
    //         const uniqueTimer = await TimerModel.findOne()

    //         if (uniqueTimer) {
    //             return res.status(409).json({
    //                 message: 'Таймер уже существует.'
    //             })
    //         }
    //         const {
    //             title, description,
    //             region,timer,
    //             imagesWithDetails } = req.body 

    //             const file = req.file

    //             const images = [];

    //             if (file) {
    //                 const optimizedSrc = await saveFile(file);
    //                 images.push({ _id: crypto.randomUUID(), src: optimizedSrc });
    //             }

    //             console.log(images) 

    //         const newTimer = new TimerModel({
    //             title,
    //             description,
    //             region,
    //             timer,
    //             imagesWithDetails: [{
    //                 images,
    //                 details: imagesWithDetails.details,
    //             }],
    //         });

    //         const addNewTimer = await newTimer.save()

    //         res.status(200).json({message:'Таймер добавлен', addNewTimer})
    //     } catch(e) {
    //         next(e)
    //     }
    // }

    async addNewTimer(req, res, next) {
        try {
            const uniqueTimer = await TimerModel.findOne();
            if (uniqueTimer) {
                return res.status(409).json({
                    message: 'Таймер уже существует.'
                });
            }
    
            const { title, description, region, timer, imagesWithDetails } = req.body;
            const files = req.file;

            console.log(req.file, req.files)
    
            // const photos = await Promise.all(files.map(async (file) => {
            //     const optimizedSrc = await saveFile(file);
            //     return { _id: crypto.randomUUID(), src: optimizedSrc };
            // }));
    
            // const imagesWithDetail = imagesWithDetails.map((detail, index) => ({
            //     _id: photos[index]._id,
            //     src: photos[index].src,
            //     header: detail.header,
            //     category: detail.category,
            //     describe: detail.describe
            // }));
    
            // const newTimer = new TimerModel({
            //     title,
            //     description,
            //     region,
            //     timer,
            //     imagesWithDetail
            // });
    
            // const savedTimer = await newTimer.save();
    
            // res.status(200).json({ 
            //     message: 'Таймер добавлен', 
            //     timer: savedTimer 
            // });
        } catch (e) {
            next(e)
        }
    }

    async editTimer(req, res, next) {
        try{
            const updatedTimer = await TimerModel.findByIdAndUpdate(
                req.body,
                { new: true })
            
            if(!updatedTimer) {
                res.status(404).json({ message: 'Таймер не найден' })
            }

            res.status(200).json({
                message: 'Таймер обновлен',
                updatedTimer
            })
        } catch(e) {
            next(e)
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
const TimerModel = require('../models/timer-model')

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
        try{
            const {
                title,
                description,
                timer,
                images } = req.body 

            const newTimer = new TimerModel({
                title,
                description,
                timer,
                images
            })

            const addNewTimer = await newTimer.save()

            res.status(200).json({message:'Таймер добавлен', addNewTimer})
        } catch(e) {
            next(e)
        }
    }

    async editTimer(req, res, next) {
        try{
            const {id} = req.params

            if (!id) {
                return res.status(400).json({ message: 'id не указан' })
            }

            const updatedTimer = await TimerModel.findByIdAndUpdate(
                id, req.body,
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
        try{
            const { id } = req.params

            if (!id) {
                res.status(400).json({ message: 'id не указан' })
            }

            const deletedTimer = await TimerModel.findByIdAndDelete(id)

            if(!deletedTimer) {
                res.status(404).json({ message: 'Таймер не найден' })
            }

            res.status(200).json({
                message: 'Таймер удален',
                deletedTimer
            })
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new TimerController()
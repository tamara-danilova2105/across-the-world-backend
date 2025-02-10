const DataFAQModel = require("../models/faq-model");

class FAQController {
    async getAllFAQs(req, res) {
        try {
            const faqs = await DataFAQModel.find();
            res.status(200).json(faqs);
        } catch (error) {
            res.status(500).json({ message: "Ошибка при получении списка FAQ", error });
        }
    }

    async updateFAQs(req, res) {
        try {
            const { faqs } = req.body;

            if (!Array.isArray(faqs) || faqs.length === 0) {
                return res.status(400).json({ message: "Список FAQ не может быть пустым" });
            }

            await DataFAQModel.deleteMany({});

            const newFAQs = await DataFAQModel.insertMany(faqs);

            res.status(200).json(newFAQs);
        } catch (error) {
            res.status(500).json({ message: "Ошибка при обновлении списка FAQ", error });
        }
    }
}

module.exports = new FAQController();

const mongoose = require("mongoose");

const DataFAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const DataFAQModel = mongoose.model("DataFAQ", DataFAQSchema);
module.exports = DataFAQModel;

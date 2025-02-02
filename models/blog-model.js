const mongoose = require('mongoose');
const uuidv4 = require('uuid');

const NewsBlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        photos: [
            {
                _id: { type: String, default: uuidv4 },
                src: { type: String, required: true },
            },
        ],
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const NewsBlogModel = mongoose.model("NewsBlog", NewsBlogSchema);

module.exports = NewsBlogModel;

const mongoose = require('mongoose');

const NewsBlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [
            {
                _id: { type: String, required: true },
                src: { type: String, required: true },
            },
        ],
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const NewsBlogModel = mongoose.model("NewsBlog", NewsBlogSchema);

export default NewsBlogModel;

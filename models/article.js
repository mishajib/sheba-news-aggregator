const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publicationDate: {
        type: Date,
        required: false,
    },
    sourceURL: {
        type: String,
        required: false
    },
    topics: {
        type: [String],
        required: false,
    },
}, {
    timestamps: true,
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;

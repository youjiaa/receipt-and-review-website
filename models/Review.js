const mongoose = require('mongoose');
mongoose.Promise = global.Promise

var reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

var reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reviewbody: {
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
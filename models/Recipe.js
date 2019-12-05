const mongoose = require('mongoose');
mongoose.Promise = global.Promise
const Review = require('./Review');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        min: 0.0,
    },
    unit: {
        type: String,
    }
})

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [ingredientSchema],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    prepTime: {
        type: Number,
        min: 0,
        required: true
    },
    cookTime: {
        type: Number,
        min: 0,
        required: true
    },
    directions: {
        type: [String],
        required: true
    },
    holiday: {
        type:Boolean
    },
    quick: {
        type:Boolean
    },
    timePosted: {
        type: String
    },
    reviews: [Review.schema]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
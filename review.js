// This is the review.js file that will be used to deal with different things
// related to a review
var recipeOperations = require("./recipe")

function addReview(data, nameIn, review) {
    var somerecipe;
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == nameIn)
            somerecipe = data[i];
    }
    somerecipe.reviews.push(review);
}
module.exports = {
    addReview: addReview
}
// This is the review.js file that will be used to deal with different things
// related to a review
function addReview(data, name, review) {
    var somerecipe;     
    for (var i = 0; i < data.length; i++) {
        if (data[i].recipeName == name)
            somerecipe = data[i];
    }
    somerecipe.reviews.push(review);
    
}
module.exports = {
    addReview: addReview
}
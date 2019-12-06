// This is the review.js file that will be used to deal with different things
// related to a review
function addReview(data, name, review) {
    var somerecipe;
    for (var i = 0; i < data.length; i++) {
        if (data[i].recipeName == name)
            somerecipe = data[i];
    }
    somerecipe.reviews.push(review);
    //somerecipe.save()

    somerecipe.save(function (err) {
        console.log("errrrorr")
        if (err) throw err;
        res.send('your review was successfully added!');
    })
}
module.exports = {
    addReview: addReview
}
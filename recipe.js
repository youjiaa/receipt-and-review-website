// This is the recipe.js file that will be used to deal with different things
// related to a recipe

function updateScore(data, name) {
    var someRecipe;     
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == name)
            someRecipe = data[i];
    }

    var reviewsArr = someRecipe.reviews;
    var val = 0;
    for (var j = 0; j < reviewsArr.length; j++) {
        val = val + parseInt(reviewsArr[j]);
    }

    someRecipe.rating = val/reviewsArr.length;
    someRecipe.rating = someRecipe.rating.toFixed(1);
    someRecipe.save(function (err) {
        if (err) throw err;
    })
}

function getReviews(recipe) {
    var fin = []
    for (var i = 0; i < recipe.reviews.length; i++) {
        var dict = {
            "name" : recipe.reviews[i].name,
            "rating" : recipe.reviews[i].rating,
            "reviewBody" : recipe.reviews[i].reviewbody
        }
        fin.push(dict);
    }
    return fin;
}
function getRecipeByName(data, nameIn) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == nameIn)
            return data[i];
    }
}

module.exports = {
    updateScore: updateScore,
    getRecipeByName: getRecipeByName,
    getReviews: getReviews
}
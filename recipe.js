// This is the recipe.js file that will be used to deal with different things
// related to a recipe

// Some ideas:

// 1. A function to calculate the average review score
// 2. A function to get all the reviews related to the particular recipe
function updateScore(data, name) {
    var someRecipe;     
    for (var i = 0; i < data.length; i++) {
        if (data[i].recipeName == name)
            someRecipe = data[i];
    }

    var reviewsArr = someRecipe.reviews;
    var val = 0;
    for (var j = 0; j < reviewsArr.length; j++) {
        val = val + parseInt(reviewsArr[j]);
    }

    someRecipe.rating = val/reviewsArr.length;
    someRecipe.rating = someRecipe.rating.toFixed(1);
}

function getReviews(recipe) {
    var fin = []
    for (var i = 0; i < recipe.reviews.length; i++) {
        var dict = {
            "rating" : recipe.reviews[i][0],
            "reviewBody" : recipe.reviews[i][1]
        }
        fin.push(dict);
    }
    return fin;
}
function getRecipeByName(data, name) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].recipeName == name)
            return data[i];
    }
}
module.exports = {
    updateScore: updateScore,
    getRecipeByName: getRecipeByName,
    getReviews: getReviews
}
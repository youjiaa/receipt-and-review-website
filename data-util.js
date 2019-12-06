//Credit: Blog Post Example from lecture

var fs = require('fs');
var reviewOperations = require("./review")
var recipeOperations = require("./recipe")

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
    var obj = {
        recipes: data
    };

    fs.writeFileSync('data.json', JSON.stringify(obj));
}

function getRandom(data) {
    var random = [];
    console.log(data);
    if (data.length > 0)
        random.push(data[Math.floor(Math.random() * data.length)]);
    return random;
}

function getRecentlyAdded(data) {
    var recent = [];
    if (data.length > 0)
        recent.push(data[data.length - 1]);
    return recent;
}

function getPopular(data) {
    var recent = [];
    var pop = data[0];
    var poplength = data[0].reviews.length;
    for (var i = 0; i < data.length; i++) {
        if (data[i].reviews.length > poplength) {
            pop = data[i];
            poplength = data[i].length;
        }
    }
    recent.push(pop);
    return recent;
}

function getHighestRated(data) {
    var recent = [];
    var highest = data[0];
    var highestrating = parseFloat(data[0].rating);
    for (var i = 0; i < data.length; i++) {
        if (parseFloat(data[i].rating) > highestrating) {
            highest = data[i];
            highestrating=parseFloat(data[i].rating);
        }
    }
    recent.push(highest);
    return recent;
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
    getRandom: getRandom,
    getRecentlyAdded: getRecentlyAdded,
    getPopular: getPopular,
    getHighestRated: getHighestRated
}

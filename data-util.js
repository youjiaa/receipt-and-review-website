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

    var i = 0;
    while (data[i].reviews.length > 2) {
        recent.push(data[data.length - 1]);
        i++;
    }
    return recent;
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
    getRandom: getRandom,
    getRecentlyAdded: getRecentlyAdded,
    getPopular: getPopular
}

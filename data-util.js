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
    if (data.length > 0)
        random.push(data[Math.floor(Math.random() * data.length)]);
    return random;
}

// Modify to filter data
function getHoliday(data) {
    return data;
}

function getQuick(data) {
    return data;
}

function getPopular(data) {
    return data;

}

function getHighestRated(data) {
    return data;
    //var
}

function getRecentlyAdded(data) {
    var recent = [];
    if (data.length > 0)
        recent.push(data[data.length - 1]);
    return recent;
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
    getHighestRated: getHighestRated,
    getRandom: getRandom,
    getRecentlyAdded: getRecentlyAdded,
    getHoliday: getHoliday,
    getQuick: getQuick,
    getPopular: getPopular
}

//Credit: Blog Post Example from lecture

var fs = require('fs');

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

function getHoliday(data) {
    var recent = [];
    if (data.length > 0)
        recent.push(data[data.length - 1]);
    return recent;
}

function getQuick(data) {
    var target = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].rent < 1000)
            target.push(data[i]);
        else if (data[i].div == "Per Unit" && data[i].rent / data[i].beds < 1000)
            target.push(data[i]);
    }

    return target;
}

function getPopular(data) {
    var bybed = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].div == "Per Person")
            bybed.push(data[i]);
    }
    return bybed;

}

function getHighestRated(data) {
    //var
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

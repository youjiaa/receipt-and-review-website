var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var moment = require('moment');
var app = express();
var dataUtil = require("./data-util");
var _DATA = dataUtil.loadData().recipes;
var request = require('request');

// Web socket things
const http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


// For importing/using the modules recipe.js and review.js
var reviewOperations = require("./review")
var recipeOperations = require("./recipe")

// For MongoDB
const mongoose = require('mongoose');
var dotenv = require('dotenv');
mongoose.Promise = global.Promise;
const Recipe = require('./models/Recipe');
const Review = require('./models/Review');

// Load environment variables

dotenv.config();

// Connect to the database
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);

// Making sure we are connected
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// Test endpoint
app.post('/recipe', function (req, res) {
  const recipe = new Recipe({
    name: req.body.name,
    ingredients: [{
      name: "testIngredient",
      amount: parseInt(3),
      unit: "cups"
    }],
    rating: parseFloat(req.body.rating),
    prepTime: parseInt(req.body.prepTime),
    cookTime: parseInt(req.body.cookTime),
    directions: this.directions.push.req.body.directions,
    reviews: []
  });

  recipe.save(function (err) {
    if (err) throw err;
    return res.send('Successfully inserted the recipe!')
  });
});


app.post('/addRecipe', function (req, res) {
  var body = req.body;
  var ingredientPassedIn = body.ingredients.split(",");
  var filteredIngredients = ingredientPassedIn.filter(function (value, index, directs) {
    return value != "" && value != " ";
  });
  body.ingredients = filteredIngredients;
  let finalIngredients = [];
  filteredIngredients.forEach(element => {
    finalIngredients.push({ name: element });
  });
  var directs = body.directions.split(";");
  var filteredDirects = directs.filter(function (value, index, directs) {
    return value != "" && value != " ";
  });
  body.directions = filteredDirects;
  body.time = moment().format('MMMM Do YYYY, h:mm a');
  if (!body.special) { //body.special DNE
    body.holiday = false;
    body.quick = false;
  }

  else if (body.special == "holidayRecipe") {
    body.holiday = true;
    body.quick = false;
  }

  else if (body.special == "quickAndEasy") {
    body.holiday = false;
    body.quick = true;
  }

  else { //body.special is an array, so that means both were selected
    body.holiday = true;
    body.quick = true;
  }
  body.reviews = [];
  body.rating = 0;
  let rec = new Recipe({
    name: body.recipeName,
    ingredients: finalIngredients,
    rating: body.rating,
    prepTime: body.prepTime,
    cookTime: body.cookTime,
    directions: filteredDirects,
    holiday: body.holiday,
    quick: body.quick,
    timePosted: body.time,
    reviews: []
  })
  // _DATA.push(req.body);
  // dataUtil.saveData(_DATA);
  rec.save(function (err) {
    if (err) throw err;
    io.emit('new recipe', rec);
  })
  res.redirect("/");
})

// TODO: Add review currently posts to data.json, revise so it posts to MongoDB
app.post('/addReview/:name', function (req, res) {
  var nameOf = req.params.name;
  var body = req.body;
  //A review consists of a two element array: arr[0] is the rating, arr[1] is the review content
  var review = []
  review.push(body.reviewName);
  review.push(body.rating);
  review.push(body.reviewContent);
  reviewOperations.addReview(_DATA, nameOf, review);
  dataUtil.saveData(_DATA);
  recipeOperations.updateScore(_DATA, nameOf);
  dataUtil.saveData(_DATA);

  review.save(function (err) {
    if (err) throw err;
    res.send('your review was successfully added!');
  })

  res.redirect("/");
})

app.get('/api/random', function (req, res) {
  Review.find({}, function (err, songs) {
    var review = dataUtil.getRandom(songs)
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/highestRated', function (req, res) {
  Review.find({ rating: 5 }, function (err, review) {
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/popular', function (req, res) {
  Review.find({}, function (err, songs) {
    var review = dataUtil.getPopular(songs)
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/newest', function (req, res) {
  Review.find({}, function (err, songs) {
    var review = dataUtil.getRecentlyAdded(songs)
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/holiday', function (req, res) {
  Review.find({ holiday: true }, function (err, review) {
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/quick', function (req, res) {
  Review.find({ quick: true }, function (err, review) {
    if (err) throw err;
    res.json(review);
  });
})

//delete a recipe
app.delete('/removeRecipe/:name', (req, res) => {
  if (!req.query.name) {
    return res.status(400).send('Missing query parameter: recipe name')
  }

  Recipe.findOneAndRemove({
    name: req.query.name
  })
    .then(doc => {
      io.emit("deleted recipe", req.query.name);
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

app.delete('/removeReview', function (req, res) {
  if (!req.query.name) {
    return res.status(400).send('Missing query parameter: recipe name')
  }

  Review.findOneAndRemove({
    name: req.query.name
  })
    .then(doc => {
      io.emit("deleted review", req.query.name);
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Note by Theo:
// These are the endpoints that I used to get all of the different listings
// Use these as a baseline to get the data needed for the recipe project

// Refer to my data-util.js to get some more information on how I went about
// Filtering the data json object to get the info I needed.

// .get() functionality should be here, but the information should be encapsulated
// and obtained in the recipe.js and review.js files

//post in html form 

app.get('/', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('home', {
      header: "Home",
      content: "Welcome to UMD Recipes",
      data: recipes
    });
  });
});

//  TODO: All of these currently pull from data.json, update following
// the method above to work with MongoDB
app.get('/highestRated', function (req, res) {
  Recipe.find({ rating: 5 }, function (err, con) {
    return res.render('recipes', { data: con })
  })
})

// TODO: Edit to access MongoDB
app.get('/popular', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('recipes', {
      header: "Random Recipe",
      data: dataUtil.getPopular(recipes)
    });
  });
})

app.get('/holiday', function (req, res) {
  Recipe.find({ holiday: true }, function (err, con) {
    return res.render('recipes', {
      data: con,
      header: "Holiday Recipes"
    });
  });
})

app.get('/quick', function (req, res) {
  Recipe.find({ quick: true }, function (err, con) {
    return res.render('recipes', { data: con });
  });
})

app.get('/allRecipes', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('recipes', {
      header: "All Recipes",
      data: recipes
    });
  });
})

app.get('/random', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('recipes', {
      header: "Random Recipe",
      data: dataUtil.getRandom(recipes)
    });
  });
});

app.get('/newest', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('recipes', {
      header: "Newest Recipe",
      data: dataUtil.getRecentlyAdded(recipes)
    });
  });
})

app.get('/addRecipe', function (req, res) {
  res.render('addrecipe', {})
})

app.get('/addReview/:nameOfRecip', function (req, res) {
  var name = req.params.nameOfRecip;
  res.render('addReview', {
    nameOfRecip: name
  })
})

//It redirects to the page that displays the reviews for a recipe. 
//It can be removed if we want the reviews to be on the same page as the recipe itself
// // TODO: Edit to access MongoDB
// app.get('/reviews/:name', function (req, res) {
//   var name = req.params.name;
//   var recip = recipeOperations.getRecipeByName(_DATA, name);
//   var reviews = recipeOperations.getReviews(recip);
//   res.render('reviews', {
//     data: reviews,
//     nameRecip: name
//   })
// })

app.get('/description', function (req, res) {
  res.render('description', {})
})
/* app.listen(3000, function() {
    console.log('Listening on port 3000!');
}); */
http.listen(process.env.PORT || 3000);
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
  var filteredIngredients = ingredientPassedIn.filter(function(value, index, directs){
    return value != "" && value !=" ";
  });
  body.ingredients = filteredIngredients;
  let finalIngredients = [];
  filteredIngredients.forEach(element => {
    finalIngredients.push({name: element});
  });
  var directs = body.directions.split(";");
  var filteredDirects = directs.filter(function(value, index, directs){
    return value != "" && value !=" ";
  });
  body.directions = filteredDirects;
  body.time = moment().format('MMMM Do YYYY, h:mm a');
  if (!body.special){ //body.special DNE
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
  rec.save(function(err){
    if(err) throw err;
    io.emit('new recipe', rec);
  })
  res.redirect("/");
})

// TODO: Add review currently posts to data.json, revise so it posts to MongoDB
app.post('/addReview/:name', function(req, res) {
  var nameOf = req.params.name;
  var body = req.body;
  //A review consists of a two element array: arr[0] is the rating, arr[1] is the review content
  var review = []
  review.push(body.rating);
  review.push(body.reviewContent);
  reviewOperations.addReview(_DATA, nameOf, review);
  dataUtil.saveData(_DATA);
  recipeOperations.updateScore(_DATA, nameOf);
  dataUtil.saveData(_DATA);
  res.redirect("/");
})

// TODO: Edit to access MongoDB
app.get('/api/random', function (req, res) {
  res.send(dataUtil.getRandom(_DATA));
})

// TODO: Edit to access MongoDB
app.get('/api/highestRated', function (req, res) {
  res.send(dataUtil.getHighestRated(_DATA));
})

// TODO: Edit to access MongoDB
//most reviewed
app.get('/api/popular', function (req, res) {
  res.send(dataUtil.getPopular(_DATA));
})

// TODO: Edit to access MongoDB
app.get('/api/newest', function (req, res) {
  res.send(_DATA[_DATA.length - 1]);
})

// TODO: Edit to access MongoDB
//not done with util func
app.get('/api/holiday', function (req, res) {
  res.send(dataUtil.getHoliday(_DATA));
})

// TODO: Edit to access MongoDB
//not done with util func
app.get('/api/quick', function (req, res) {
  res.send(dataUtil.getQuick(_DATA));
})

// TODO: Edit to access MongoDB
//post to api endpoint
app.post('/api/addRecipe', function (req, res) {

})

// TODO: Edit to access MongoDB
app.post('/api/addReview', function (req, res) {

})

//delete a recipe
app.delete('/removeRecipe', (req, res) => {
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

// TODO
app.delete('/removeReview', function(req, res) {

})

// app.post('/api/addlisting', function (req, res) {
//   var body = req.body;
//   body.features = [];
//   if (body['features[0]']) {
//     var i = 0;
//     while (body["features[" + i + "]"]) {
//       body.features.push(body["features[" + i + "]"]);
//       delete body["features[" + i + "]"];
//       i++;
//     }
//   }
//   _DATA.push(body);
//   dataUtil.saveData(_DATA);
//   res.redirect("/");
// })


// Note by Theo:
// These are the endpoints that I used to get all of the different listings
// Use these as a baseline to get the data needed for the recipe project

// Refer to my data-util.js to get some more information on how I went about
// Filtering the data json object to get the info I needed.

// .get() functionality should be here, but the information should be encapsulated
// and obtained in the recipe.js and review.js files

//post in html form 

app.get('/',function(req,res){
  Recipe.find({}, function(err, recipes) {
    return res.render('home', {
      header: "Home",
      content: "Welcome to UMD Recipes",
      data: recipes
    });
  });
});

// All of these currently pull from data.json, update following
// the method above to work with MongoDB
app.get('/highestRated', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getHighestRated(_DATA),
    content: "Our highest rated recipe",
    header: "Highest Rated Recipe"
  })
})

// TODO: Edit to access MongoDB
//most reviewed
app.get('/popular', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getPopular(_DATA),
    content: "Our most reviewed recipe",
    header: "Most Popular Recipe"
  })
})

// TODO: Edit to access MongoDB
app.get('/holiday', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getHoliday(_DATA),
    header: "Holiday Recipes"
  });
})

// TODO: Edit to access MongoDB
app.get('/quick', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getQuick(_DATA),
    header: "Quick & Easy Recipes"
  });
})

app.get('/allRecipes', function (req, res) {
  Recipe.find({}, function(err, recipes) {
    return res.render('recipes', {
      header: "All Recipes",
      data: recipes
    });
  //res.render('recipes', {
  // data: _DATA,
  //header: "All Recipes"
  //});
  });
})

app.get('/random', function (req, res) {
  Recipe.find({}, function(err, recipes) {
    return res.render('recipes', {
      header: "Random Recipe",
      data: dataUtil.getRandom(recipes)
    });
  //res.render('recipes', {
    //data: dataUtil.getRandom(_DATA),
    //header: "Random Recipe"
 // })
  });
});

// TODO: Edit to access MongoDB
app.get('/newest', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getRecentlyAdded(_DATA),
    content: "Our newest recipe!",
    header: "Newest Recipe"
  })
})

// TODO: Edit to access MongoDB
app.get('/addRecipe', function (req, res) {
  res.render('addrecipe', {})
})

app.get('/addReview/:nameOfRecip', function (req, res) {
  var name = req.params.nameOfRecip;
  res.render('addReview', {
    nameOfRecip: name
  })
})

// TODO
app.get('/removeRecipe/:name', function(req, res) {
  var name = req.params.name;
  // do something to delete recipe
  res.redirect('/');
})

// TODO
app.get('/removeReview', function(req, res) {
  // do something to delete review
})

// TODO: Edit to access MongoDB
app.get('/reviews/:name', function (req, res) {
  var name = req.params.name;
  var recip = recipeOperations.getRecipeByName(_DATA, name);
  var reviews = recipeOperations.getReviews(recip);
  res.render('reviews', {
    data: reviews,
    nameRecip: name 
  })
})

app.get('/description', function (req, res) {
  res.render('description', {})
})
/* app.listen(3000, function() {
    console.log('Listening on port 3000!');
}); */
http.listen(process.env.PORT || 3000);
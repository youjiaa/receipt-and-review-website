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
  rec.save(function (err) {
    if (err) throw err;
    io.emit('new recipe', rec);
  })
  res.redirect("/");
})
app.post('/addReview/:name', function (req, res) {
  var nameOf = req.params.name;
  var body = req.body;
  var reviewInf = []
  reviewInf.push(body.reviewName);
  reviewInf.push(body.rating);
  reviewInf.push(body.reviewContent);
  let review = new Review({
    name: reviewInf[0],
    reviewbody: reviewInf[2],
    rating: reviewInf[1]
  })
  review.save(function (err) {
    if (err) throw err;
    io.emit('new review', review);
  })
  Recipe.find({}, function (err, allrecipes) {
    reviewOperations.addReview(allrecipes, nameOf, review);
    recipeOperations.updateScore(allrecipes, nameOf);
  })
  res.redirect("/");
})

app.get('/api/random', function (req, res) {
  Recipe.find({}, function (err, songs) {
    var review = dataUtil.getRandom(songs)
    if (err) throw err;
    res.json(review);
  });
})
app.get('/api/allRecipes', function (req, res) {
  Recipe.find({}, function (err, songs) {
    if (err) throw err;
    res.json(songs);
  });
})
app.get('/api/highestRated', function (req, res) {
  Recipe.find({}, function (err, review) {
    var ans = dataUtil.getHighestRated(review)
    if (err) throw err;
    res.json(ans);
  });
})

app.get('/api/popular', function (req, res) {
  Recipe.find({}, function (err, songs) {
    var review = dataUtil.getPopular(songs)
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/newest', function (req, res) {
  Recipe.find({}, function (err, songs) {
    var review = dataUtil.getRecentlyAdded(songs)
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/holiday', function (req, res) {
  Recipe.find({ holiday: true }, function (err, review) {
    if (err) throw err;
    res.json(review);
  });
})

app.get('/api/quick', function (req, res) {
  Recipe.find({ quick: true }, function (err, review) {
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

app.delete('/removeReview/:recipname/:reviewname', function (req, res) {
  // do something to delete review
  var revNm = req.params.reviewname;
  var recipname = req.params.recipname;
  var recip;
  Recipe.find({}, function (err, recipes) {
    recip = recipeOperations.getRecipeByName(recipes, recipname);
    reviewOperations.deleteReviewByName(recip, revNm);
    recipeOperations.updateScore(recipes, recipname);
  })
  res.redirect('/')
})
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

app.get('/highestRated', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('recipes', { 
      data: dataUtil.getHighestRated(recipes),
    header: "Highest Rated Recipe" })
  })
})

app.get('/popular', function (req, res) {
  Recipe.find({}, function (err, recipes) {
    return res.render('recipes', {
      header: "Popular Recipe",
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
    return res.render('recipes', { 
      data: con,
      header: "Quick & Easy Recipes" });
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
app.get('/api/reviews/:nameOfRecip', function (req, res) {
  var name = req.params.nameOfRecip;
  Recipe.find({}, function (err, recipes) {
    recip = recipeOperations.getRecipeByName(recipes, name);
    var reviews = recipeOperations.getReviews(recip);
    res.json(reviews)
  });
})

app.get('/removeRecipe/:name', function (req, res) {
  var nameIn = req.params.name;
  if (!nameIn) {
    return res.status(400).send('Missing query parameter: recipe name')
  }

  Recipe.findOneAndRemove({
    name: nameIn
  })
    .then(doc => {
      io.emit("deleted recipe", nameIn);
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err)
    })
  res.redirect('back');
})

app.get('/removeReview/:recipname/:reviewname', function (req, res) {
  var revNm = req.params.reviewname;
  var recipname = req.params.recipname;
  var recip;
  Recipe.find({}, function (err, recipes) {
    recip = recipeOperations.getRecipeByName(recipes, recipname);
    reviewOperations.deleteReviewByName(recip, revNm);
    recipeOperations.updateScore(recipes, recipname);
  })

  

  res.redirect('/')
})

app.get('/reviews/:name', function (req, res) {
  var name = req.params.name;
  var recip 
  Recipe.find({}, function (err, recipes) {
    recip = recipeOperations.getRecipeByName(recipes, name);
    var reviews = recipeOperations.getReviews(recip);
    res.render('reviews', {
      data: reviews,
      nameRecip: name
    })
  });
})

app.get('/description', function (req, res) {
  res.render('description', {})
})
/* app.listen(3000, function() {
    console.log('Listening on port 3000!');
}); */
http.listen(process.env.PORT || 3000);
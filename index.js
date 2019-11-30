var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var moment = require('moment');
var app = express();
var dataUtil = require("./data-util");
var _DATA = dataUtil.loadData().recipes;
var request = require('request');

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

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */
app.get('/api/random', function (req, res) {
  res.send(dataUtil.getRandom(_DATA));
})

app.get('/api/highestRated', function (req, res) {
  res.send(dataUtil.getHighestRated(_DATA));
})

//most reviewed
app.get('/api/popular', function (req, res) {
  res.send(dataUtil.getRecentlyAdded(_DATA));
})

app.get('/api/newest', function (req, res) {
  res.send(_DATA[_DATA.length - 1]);
})

//not done with util func
app.get('/api/holiday', function (req, res) {
  res.send(dataUtil.getHoliday(_DATA));
})

//not done with util func
app.get('/api/quick', function (req, res) {
  res.send(dataUtil.getQuick(_DATA));
})

//post to api endpoint
app.post('/api/addRecipe', function (req, res) {

})

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
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Currently, the addRecipe posts to JSON, modify
// to post to MongoDB
app.post('/addRecipe', function (req, res) {
   var body = req.body;
   body.ingredients = body.ingredients.split(",");
   body.directions = body.directions.split(";");
   body.time = moment().format('MMMM Do YYYY, h:mm a');

   _DATA.push(req.body);
   dataUtil.saveData(_DATA);
   res.redirect("/");
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
  res.render('home',{
    header: "Home",
    content: "Welcome to UMD Recipes",
    data: _DATA
  });
})

app.get('/highestRated', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getAllTenMonthLeases(_DATA),
    content: "Our highest rated recipe",
    header: "Highest Rated Recipe"
  })
})

//most reviewed
app.get('/popular', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getAllTenMonthLeases(_DATA),
    content: "Our highest rated recipe",
    header: "Highest Rated Recipe"
  })
})

app.get('/holiday', function (req, res) {
  res.render('recipes', {
    data: _DATA,
    header: "Holiday Recipes"
  });
})

app.get('/quick', function (req, res) {
  res.render('recipes', {
    data: _DATA,
    header: "Quick & Easy Recipes"
  });
})

app.get('/addRecipe', function (req, res) {
  res.render('addrecipe', {})
})

app.get('/addReview', function (req, res) {
  res.render('addReview', {})
})

app.get('/allRecipes', function (req, res) {
  res.render('recipes', {
    data: _DATA,
    header: "All Recipes"
  });
})

app.get('/random', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getRandom(_DATA),
    header: "Random Recipe"
  })
})

app.get('/newest', function (req, res) {
  res.render('recipes', {
    data: dataUtil.getRecentlyAdded(_DATA),
    content: "Our newest recipe!",
    header: "Newest Recipe"
  })
})

/* app.listen(3000, function() {
    console.log('Listening on port 3000!');
}); */
app.listen(process.env.PORT || 3000);
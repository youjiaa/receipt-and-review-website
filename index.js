var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var moment = require('moment');
var app = express();
var dataUtil = require("./data-util");
var _DATA = dataUtil.loadData().listings;
var request = require('request');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

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
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// Test endpoint
app.post('/recipe', function(req, res) {
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
    directions: req.body.directions,
    reviews: []
    });

    recipe.save(function(err) {
      if (err) throw err;
      return res.send('Successfully inserted the recipe!')
    });
  });

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/',function(req,res){
  res.render('home',{
    header: "Home",
    content: "Welcome to College Park Student Housing Finder",
    data: _DATA
  });
})

app.get('/api/listings', function(req, res) {
  res.send(_DATA);
})
app.get('/api/random', function(req, res) {
  res.send(dataUtil.getRandom(_DATA));
})

app.get('/api/tenmonth', function(req, res) {
  res.send(dataUtil.getAllTenMonthLeases(_DATA));
})

app.get('/api/new', function(req, res) {
  res.send(_DATA[_DATA.length - 1]);
})

app.get('/api/underonek', function(req, res) {
  res.send(dataUtil.getUnderOneK(_DATA));
})

app.get('/api/bythebed', function (req, res) {
  res.send(dataUtil.getByTheBed(_DATA));
})




app.get("/addlisting", function(req, res) {
  res.render('addlisting');
})

app.post('/addlisting', function(req,res) {
  var body = req.body;
  body.features = body.features.split(",");
  body.time = moment().format('MMMM Do YYYY, h:mm a');

  _DATA.push(req.body);
  dataUtil.saveData(_DATA);
  res.redirect("/");

})

app.post('/api/addlisting', function(req,res) {
  var body = req.body;
  body.features = [];
  if(body['features[0]']) {
    var i = 0;
    while (body["features[" + i + "]"]) {
      body.features.push(body["features[" + i + "]"]);
      delete body["features[" + i + "]"];
      i++;
    }
  }
  _DATA.push(body);
  dataUtil.saveData(_DATA);
  res.redirect("/");
})

// Note by Theo:
// These are the endpoints that I used to get all of the different listings
// Use these as a baseline to get the data needed for the recipe project

// Refer to my data-util.js to get some more information on how I went about
// Filtering the data json object to get the info I needed.

// .get() functionality should be here, but the information should be encapsulated
// and obtained in the recipe.js and review.js files
app.get('/listings', function(req,res) {
  res.render('listings', {
    data: _DATA,
    header: "All Listings"
  });
})

app.get('/random', function(req, res) {
  res.render('listings', {
    data: dataUtil.getRandom(_DATA),
    header: "Random Listing"
  })
})

app.get('/tenmonth', function(req, res) {
  res.render('listings', {
    data: dataUtil.getAllTenMonthLeases(_DATA),
    content: "Ten month leases are perfect for students who do not plan on being in the College Park area over the summer.",
    header: "Ten Month Leases"
  })
})

app.get('/new', function(req, res) {
  res.render('listings', {
    data: dataUtil.getRecentlyAdded(_DATA),
    content: "Our newest listing!",
    header: "Recently Listed"
  })
})

app.get('/underonek', function(req, res) {
  res.render('listings', {
    header: "Listings Under $1000 A Month",
    content: "Listings under $1000 per month per person",
    data: dataUtil.getUnderOneK(_DATA)
  })
})

app.get('/bythebed', function (req, res) {
  res.render('listings', {
    header: "By The Bed Rentals",
    content: "By the bed rentals are unique to student housing. " +
    "Your housing status does not depend on your roommates' ability to turn in rent on time. " +
    "Each month, you only pay for your own bedroom's lease.",
    data: dataUtil.getByTheBed(_DATA)
  })
})

/* app.listen(3000, function() {
    console.log('Listening on port 3000!');
}); */
app.listen(process.env.PORT || 3000);
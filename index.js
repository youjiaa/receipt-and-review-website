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
/* app.listen(3000, function() {
    console.log('Listening on port 3000!');
}); */
app.listen(process.env.PORT || 3000);
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

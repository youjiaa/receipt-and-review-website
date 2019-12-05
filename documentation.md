
# UMD Recipes

---

Name: Theodore Gwo, Youjia Wang, Wilson Zheng

Date: 06 December 2019

Project Topic: Recipe sharing and rating website

URL: 
1. http://umd-recipes.herokuapp.com/ (Final)
2. http://evening-wildwood-72242.herokuapp.com/ (testing purposes)

---
### Midterm Specifications

### 1. Data Format and Storage

Data point fields for a recipe:
- `name`:     Name of the recipe       `Type: String`
- `ingredients`:     Ingredients needed for the recipe       `Type: String Array`
- `prepTime`:     Amount of time needed to prepare the ingredients in minutes      `Type: int`
- `cookTime`:     Amount of time needed to cook in minutes       `Type: int`
- `timePosted`:     Recipe posting date and time       `Type: String`
- `reviews`:     Reviews for recipe       `Type: String array- index 0:rating on 1-5 scale, index 1: review content `
- `directions`:     Steps needed to follow for recipe       `Type: String array`
- `holiday`:     Holiday recipe designation       `Type: boolean`
- `quick`:     Quick & Easy recipe designation       `Type: boolean`
- `rating`:     Average rating for recipe        `Type: number`

Schema: 
```javascript
{"name":"Butterscotch Cookies","ingredients":["Sugar"," Caramel"," 2 Eggs"," Three cups flour"],"prepTime":"23","cookTime":"45","directions":["Mix sugar and caramel together"," Beat in Eggs"," Add flour"," Bake for 35 minutes in 450 degree oven"],"timePosted":"November 30th 2019, 8:08 pm","holiday":true,"quick":false,"reviews":[["4","So Easy to make!"],["5","Great!"],["4","Awesome!"],["5","Yum"],["2","Meh"]],"rating":"4.0"}
```

Datapoint fields for reviews:
- `name`: Name of teview `Type: String`
- `rating`: Numerical evaluation of the review `Type: Number`
- `reviewBody` : text body of review `Type: String`

Schema: 
```javascript
{"name":"Butterscotch Cookies Review","rating":"4.0", "reviewBody":"Great recipe! Easy to make."}
```

### 2. Add New Data

HTML form route: `/addrecipe` and `/addreview/:recipeName`

POST endpoint route: `/api/addrecipe` and `/addreview/:recipeName`

Example Node.js POST request to endpoint (adding a recipe): 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/addrecipe',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       name:"Butterscotch Cookies",
       ingredients:["Sugar"," Caramel"," 2 Eggs"," Three cups flour"],
       prepTime:"23",
       cookTime:"45",
       directions:["Mix sugar and caramel together"," Beat in Eggs"," Add flour"," Bake for 35 minutes in 450 degree oven"],
       timePosted:"November 30th 2019, 8:08 pm",
       holiday:true,
       quick:false,
       reviews:[["4","So Easy to make!"],["5","Great recipe!"],["4","Awesome!"],["5","Yum"],["2","Meh"]],rating:"4.0"
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/allRecipes` and `/api/reviews/:recipeName`

### 4. Search Data

Search Field: Name of recipe

### 5. Navigation Pages

Navigation Filters
1. Random Recipe -> `  /random  `
2. Highest Rated Recipe -> `  /highestRated  `
3. Newest recipe -> `  /newest  `
4. Most popular (most reviewed) recipe -> `  /popular  `
5. Holiday recipes -> `  /holiday  `
5. Quick & easy recipes -> `  /quick  `

### Additional Requirements

### 6. Live Updates
1. Automatically adds recipes to page without refresh (adds to the top of the home page listing)
2. Notifcations are present to inform users when a new recipe is added (blue box pops up on home page)

### 7. Viewing/Adding Data
  Handlebars.js pages:
  1. `addReview.handlebars`
  2. `addrecipe.handlebars`
  3. `home.handlebars`
  4. `recipes.handlebars`
  5. `reviews.handlebars`
  6. `main.handlebars`
  7. `description.handlebars`

  Description page `/description`

### 8. API

  Post Endpoints
  1. `/addReview/:name`
  2. `/addRecipe`

  Delete Endpoints
  1. `/removeRecipe/:name`
  2. `/removeReview`
  Additional/Get Endpoints
  1. `/` - Home page
  2. `/highestRated` - Recipe with the hihest average rating
  3. `/popular` - Most reviewed recipe
  4. `/holiday` - Holiday themed recipes
  5. `/quick` - Quick & Easy recipes
  6. `/allRecipes` - All recipes
  7. `/newest` - Newest recipe
  8. `/addRecipe` - Adding a recipe
  9. `/addReview/:nameOfRecip` - Page to add a review
  10. `/reviews/:name` - All reviews for a particular recipe

### 9. Modules
  We created the following modules:
  1. recipe.js
  2. review.js

### 10. NPM Packages
  We used the following new npm packages
  1. draggable.js
  2. less.js

### 11. User Interface
  1. The user interface has been updated to improve the user experience

### 12. Deployment
  The website is hosted on: umd-recipes.herokuapp.com

### 13. README
  See the READMEUser.md file for more information

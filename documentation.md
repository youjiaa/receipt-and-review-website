
# UMD Recipes

---

Name: Theodore, Youjia, Wilson

Date: 06 December 2019

Project Topic: Recipe sharing and rating website

URL: 

---
### Midterm Specifications

### 1. Data Format and Storage

Data point fields:
- `Field 1`:     ...       `Type: ...`
- `Field 2`:     ...       `Type: ...`
- `Field 3`:     ...       `Type: ...`
- `Field 4`:     ...       `Type: ...`
- `Field 5`:     ...       `Type: ...`

Schema: 
```javascript
{
   ...
}
```

### 2. Add New Data

HTML form route: `/...`

POST endpoint route: `/api/...`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/...',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       ...
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/...`

### 4. Search Data

Search Field: ...

### 5. Navigation Pages

Navigation Filters
1. name -> `  route  `
2. ... -> `  ...  `
3. ... -> `  ...  `
4. ... -> `  ...  `
5. ... -> `  ...  `

### Additional Requirements

### 6. Live Updates
Sockets

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
  2. react.js

### 11. User Interface
  1. The user interface has been updated to improve the user experience

### 12. Deployment
  The website is hosted on: 

### 13. README
  See the READMEUser.md file for more information

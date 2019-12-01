# UMD Recipes User Guide

## Home Page 
Route: `/`
1. On the home page, the user can see all the recipes that are currently in the database
2. The user also has the ability to filter or search through the recipes by the name of the recipe using the search bar near the top
3. On the top naviation bar, the user has the option to filter the recipes posted. They have the option to look at a random recipe, see the highest rated recipe, the newest recipe, the most reviewed recipe, holiday recipes, or quick and easy recipes
4. The bottom of the homepage has a link to the "About this website" page
## What information and shortcuts are available for each recipe?
Routes: `/`, `/allrecipes`, `/random`, `/highestRated`, `/newest`, `/holiday`, `quick`, `popular`
1. The user is presented with all information related to the particular recipe: the name of the recipe, the ingredients, the prep time, the cook time, the directions to follow, the average review rating, and any image icons to denote a quick/easy and/or holiday recipe
2. Clicking on the name of the recipe, allows the user to add a review to the recipe
3. Clicking on the "See Recipe Reviews" link at the bottom of the recipe allows users to see reviews associated with the recipe
4. Clicking on the "Remove Recipe" link at the bottom of the recipe deletes the recipe from the database.
## How do I write a review?
Route: `/addreview/:recipeName`
1. The user can click on the name of the recipe from any page displaying recipes. This will take the user to the above route
2. At this point, the user can share their 1-5 scale rating and provide their review in the textbox.
3. Clicking the button on the lower part of the page submits the review and can be viewed on the recipe reviews page.
## What is on the "About this website" page?
Route: `description`
1. Contains a description of the website and the group members

## How do I delete a recipe or a review?
Route: `/removeReview` and `/removeRecipe/:recipeName`
1. On the webpage under each review, there is a link to delete the review from the database
2. On any page displaying recipes, there will be a link at the bottom of the recipe to delete the recipe


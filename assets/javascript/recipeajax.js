$(document).ready(function() {


$(document).on("click",".cuisineButton button" function() {
  var choice = $(this).text();
  console.log(choice);
  var queryURL = "https://proxy.calweb.xyz/http://www.recipepuppy.com/api/?q="+choice;
  var request = {
      url: queryURL,
      method: "GET"
  }
  $.ajax(request).done(function(response) {
    .then(function(response){
      response.json()
      .then(function(data) {
        var recipes = data.results;

        for (i = 0; i < 10; i++){
          var recipe = recipes[i];
          function myRecipes(recipe){

            var html = `
          <div class ='recipeBox'>
           <div class="recipeThumbnail">
            <img src='${recipe.thumbnail}' alt="">
           </div>
           <div class="recipeLink">
            <a href='${recipe.href}'>'${recipe.title}'</a>
           </div>
         </div>
          `;
          return html;
        }
        var addingRecipes = myRecipes(recipe);
        container.innerHTML += addingRecipes;

      }
      //Ajax closer
  });
//Render closer


});


});

})
});


// var categories = $(this).text();
// var cities  = $(this).text();
// var cuisines = $(this).text();
// var establishments = $(this).text();
// var apiKey = "b585192e1aca10c32e449a9b7c13f1cd"

//var  recipeAPI= "key={B2fv0WZrFNmshAlRJ5F0DtYw58Lxp1ZXvXHjsnnqcm2Ot7k0U5}&q";
//var usersearch = "chicken";

var queryURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=&offset=&cuisine=" + "&number=&type=&instructionsRequired=&diet=&query=&intolerances=&excludeIngredients=&" + test2;
console.log(queryURL2);


var test2 = "search?q=";

var test = "cities?q=New%20York&count=5";


var queryURL = "https://developers.zomato.com/api/v2.1/" + test;

console.log(queryURL);

$(document).ready(function () {
  $.ajax({
    url: queryURL,
    method: "GET",
    headers:
    {
      "user-key": "b585192e1aca10c32e449a9b7c13f1cd"
    }
  })
  .done(function(response) {
    console.log(response);
  });


});


$(document).ready(function () {
  $.ajax({

    url: queryURL2,
    method: "GET",
    headers: {
       "X-Mashape-Key": "B2fv0WZrFNmshAlRJ5F0DtYw58Lxp1ZXvXHjsnnqcm2Ot7k0U5",
       "accept": "application/json",
       crossDomain:false,
       xhrFields: { withCredentials: true },
     }
  })
  .done(function(response) {
    var results = response.results;
    console.log(results);
  })
})


// function getRecipeJson() {
//         var apiKey = "";
//         var TitleKeyword = "lasagna";
//         var url = "http://api2.bigoven.com/recipes?pg=1&rpp=25&title_kw="
//                   + TitleKeyword
//                   + "&api_key="+apiKey;
//         $.ajax({
//             type: "GET",
//             dataType: 'json',
//             cache: false,
//             url: url,
//             success: function (data) {
//                 alert('success');
//                 console.log(data);
//             }
//         });
//     }

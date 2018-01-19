

// var categories = $(this).text();
// var cities  = $(this).text();
// var cuisines = $(this).text();
// var establishments = $(this).text();
// var apiKey = "b585192e1aca10c32e449a9b7c13f1cd"

var food2forkAPI = "?key={15a372b846b971348dc85396f31c7b40}&q=shredded%20chicken";
var usersearch = "chicken";

var queryURL2 = "http://food2fork.com/api/search?key=15a372b846b971348dc85396f31c7b40&q=shredded%20chicken";
console.log(queryURL2);


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
    xhrFields: { withCredentials: true },
    accept: 'application/json'
  })
  .done(function(response) {
    var results = response.data;
    console.log(results);
  });

});


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

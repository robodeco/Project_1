var finalQueryURL;
var queryBaseURL = "https://developers.zomato.com/api/v2.1/";
var cuisineVal = "";


  //get user location
$("document").ready(function () {
  var lat;
  var long;

  getLocation();

function getLocation() {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    alert("Geolocation is not supported by this browser.");
}
}

function showPosition(position) {
  lat = position.coords.latitude.toString();
  long = position.coords.longitude.toString();
  console.log(lat);
  console.log(long);

  $(".cuisineButton").on("click", function() {
    cuisineVal +=$(this).val();

    finalQueryURL = queryBaseURL + "search?q=" + cuisineVal + "lat=" + lat + "&lon=" + long

    console.log(cuisineVal);
    console.log(finalQueryURL);
  })

}

console.log("https://developers.zomato.com/api/v2.1/search?lat=38.832801&lon=-77.196229&cuisines=american%20steak%20brazilian");

    $("#submit").on("click", function() {
      console.log("hi world");
      console.log(finalQueryURL);
      $.ajax({
        url: finalQueryURL,
        method: "GET",
        headers:
        {
          "user-key": "b585192e1aca10c32e449a9b7c13f1cd"
        }
      })
      .done(function(response) {

      console.log(response.restaurants);

       var results = response.restaurants;

       for (var i = 0; i < results.length; i++) {

       var restName = response.restaurants[i].restaurant.name
       console.log(restName);
       var restWeb = response.restaurants[i].restaurant.url
       console.log(restWeb);
       var restLoca = response.restaurants[i].restaurant.location

        $("#restaurants").append("<div><p>" + restName + "</p><p>" + restWeb + "</p><p>" + restLoca + "</p><p>");
      }
    });
  });
  });

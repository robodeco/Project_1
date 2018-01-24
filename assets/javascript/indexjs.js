
//notes: eliminate signin page and add sigin function purely to modals?
  //signout would have to be through modals and rerout to signin modal
//notes: add bar on top left showing displayName of user signed in?
  //not hard, add in bootstrap, can grab display name easy enough
//notes: give previous button results actual terms used (i.e. "See your previous results for Italian and American")?
  //doable, would depend on when we add the & to the values of the buttons
  //how would we pull them back then? Maybe stored as different variables
      //stored as different variable and seperated by a comma instead of &

//firebase
var config = {
  apiKey: "AIzaSyCCePhrTpJl2GV9MRff0_-3GTUs4zYB6WQ",
  authDomain: "foodcodingstarsfeed.firebaseapp.com",
  databaseURL: "https://foodcodingstarsfeed.firebaseio.com",
  projectId: "foodcodingstarsfeed",
  storageBucket: "",
  messagingSenderId: "342995053882"
};

firebase.initializeApp(config);
var database = firebase.database();

database.ref().child("Users");


//variables
var culturepick = "";
var userprefs = {
  // timeofday : "",
  culture: "",
  price: "",
  previous: ""
}
var cultures ="";

var cuisines = ["American", "Italian", "Mexican", "Chinese", "Thai", "Afghanistan", "African", "Brazilian", "Caribbean", "European", "Ethiopian", "Filipino", "Indonesian", "Japanese", "Lebanese", "Mediterranean", "Moroccan", "Peruvian", "Portuguese", "Russian", "Vietnamese", "Vegetarian"]
var CuisinesButtonsFinished = [];
var finalQueryURL;
var queryBaseURL = "https://developers.zomato.com/api/v2.1/";

//function definitions

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
  // console.log(lat);
  // console.log(long);
}

//create cuisine buttons
function renderbuttons() {
  culturepick = "";
  cultures = "";
  $("#BtnDisplay").empty();
  CuisinesButtonsFinished = [];
  for (var i = 0; i < cuisines.length; i++) {
    var btns = $("<button>");
    var values = cuisines[i].toLowerCase();
    btns.addClass("btn btn-primary cuisineButton");
    btns.attr("checker", "unchecked");
    btns.attr("value", values);
    btns.text(cuisines[i]);
    $("#BtnDisplay").append(btns);
    CuisinesButtonsFinished.push(btns);

  };
};


//if cuisine button is clicked, give it a attr of "checked". If it is unclicked,change to "unclicked"
function checkFunction() {
  var ischecked = $(this).attr("checker");
  if (ischecked === "unchecked") {
    $(this).attr("checker", "checked");
  } else {
    $(this).attr("checker", "unchecked");
  }
}

//click handler for all cuisine buttons to run the check function
$(document).on("click", ".cuisineButton", checkFunction);


//pull previous search terms from firebase for logged in user
function previous (){
firebase.auth().onAuthStateChanged(function(user) {
  if (user){
    var displayName=user.displayName;
    $("#usernamedisplay").append("Welcome, " + displayName +"!");
    var signOutbutton = $("<a>");
    signOutbutton.addClass("btn btn-primary");
    signOutbutton.attr("href", "signin.html");
    signOutbutton.text("Not you? Sign Out");
    signOutbutton.attr("id", "signout");
    $("#signinorout").append(signOutbutton);
    $("#signout").on("click", function() {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
    });

  } else{
    var signInbutton = $("<a>");
    signInbutton.addClass("btn btn-primary");
    signInbutton.attr("href", "signin.html");
    signInbutton.text("You are not signed in! Click here!")
    $("#signinorout").append(signInbutton);
  }
  firebase.database().ref('Users/' + user.displayName).on("value", function(snapshot) {
    console.log(snapshot.val());
    var prevculture = snapshot.val().culture;
    // var prevprice = snapshot.val().price;
    // var prevtimeofday = snapshot.val().timeofday;
    console.log(prevculture + ",");
    //renders a previous search button if previous terms exist for user
    if (prevculture != ""){
      var previousbutton = $("<button>");
      previousbutton.addClass("btn btn-primary");
      previousbutton.text("See Your Previous Results!");
      $("#prevresults").append(previousbutton);

    }
  });
});
};


//loop through buttons for "checked" function. If there, add value to culture(s) picked
function GetCuisinePrefs() {
  for (var j = 0; j < CuisinesButtonsFinished.length; j++) {
    var newchecker = CuisinesButtonsFinished[j].attr("checker");
    if (newchecker === "checked") {
      cultures += CuisinesButtonsFinished[j].val().trim() + ",";
      culturepick += CuisinesButtonsFinished[j].val().trim() + "&";
    };
  };
};

//call independent functions
renderbuttons();
previous();

//clickhandlers

$("#submit").on("click", function() {
  event.preventDefault();
  GetCuisinePrefs();
  console.log(culturepick);
  userprefs.culture = culturepick;
  userprefs.previous = cultures;


  // userprefs.timeofday = $("#time-input").val();
  // userprefs.culture = culturepickpicker();
  // userprefs.price = $("#price-input").val();

  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref('Users/' + user.displayName).set(userprefs);
  });

  finalQueryURL = queryBaseURL + "search?q=" + culturepick + "lat=" + lat + "&lon=" + long + "&count=5";
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

  // console.log(response.restaurants);

   var results = response.restaurants;

   for (var i = 0; i < results.length; i++) {


    var restName = response.restaurants[i].restaurant.name
    console.log(restName);
    var restWeb = "<a class='links' href ='" + response.restaurants[i].restaurant.url+"' target='_blank'>" + response.restaurants[i].restaurant.name +"</a>"
    console.log(restWeb);
    var restLoca = response.restaurants[i].restaurant.location.address;
    // var image ="<img src='" + response.restaurants[i].restaurant.photos_url + "''></img>"
    var cost = response.restaurants[i].restaurant.average_cost_for_two;

    $("#restaurants").append("<div class='countries'><p>" + restWeb + "</p><p>");
  }
})
  renderbuttons();
});


// console.log("https://developers.zomato.com/api/v2.1/search?lat=38.832801&lon=-77.196229&cuisines=american%20steak%20brazilian");

  //   $("#submit").on("click", function() {
  //     // console.log("hi world");
  //     // console.log(finalQueryURL);
  //     $.ajax({
  //       url: finalQueryURL,
  //       method: "GET",
  //       headers:
  //       {
  //         "user-key": "b585192e1aca10c32e449a9b7c13f1cd"
  //       }
  //     })
  //     .done(function(response) {
  //
  //     // console.log(response.restaurants);
  //
  //      var results = response.restaurants;
  //
  //      for (var i = 0; i < results.length; i++) {
  //
  //      var restName = response.restaurants[i].restaurant.name
  //      // console.log(restName);
  //      var restWeb = response.restaurants[i].restaurant.url
  //      // console.log(restWeb);
  //      var restLoca = response.restaurants[i].restaurant.location.address
  //
  //
  //
  //       $("#restaurants").append("<div class='countries'><p>" + restWeb + "</p><p>");
  //     }
  //   })
  // });
  });

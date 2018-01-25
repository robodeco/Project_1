//title
var basicTimeline = anime.timeline();
basicTimeline.add({
targets: '#F',
 scale:1.5,
 duration: 300,
 easing: 'easeOutExpo'
})
.add({
  targets: '#E',
  scale:1.5,
  duration: 300,
   easing: 'easeOutExpo'
})
.add({
  targets: '#E2',
  scale:1.5,
  duration: 300,
   easing: 'easeOutExpo'
})
.add({
  targets: '#D',
  scale:1.5,
  duration: 300,
   easing: 'easeOutExpo'
})
.add({
  targets: '#B',
  scale:1.5,
  duration: 300,
   easing: 'easeOutExpo'
})
.add({
  targets: '#A',
  scale:1.5,
  duration: 300,
   easing: 'easeOutExpo'
})
.add({
  targets: '#G',
  scale:1.5,
  duration: 300,
   easing: 'easeOutExpo'
})




//firebase initialize
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
//create file in database for containing the users and their preferences
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
prevculture = "";
var usertemp = {
  culture:"",
  price:"",
  previous:""
}

var cuisines = ["American", "Italian", "Mexican", "Chinese", "Thai", "Afghan", "African", "Brazilian", "Caribbean", "European", "Ethiopian", "Filipino", "Indonesian", "Japanese", "Lebanese", "Mediterranean", "Moroccan", "Peruvian", "Portuguese", "Russian", "Vietnamese", "Vegetarian"]
var CuisinesButtonsFinished = [];
var finalQueryURL;
var queryBaseURL = "https://developers.zomato.com/api/v2.1/";
var finalQueryURL2;
var queryBaseURL2 = "https://proxy.calweb.xyz/http://www.recipepuppy.com/api/";
var cuisineVal2 = "";
var lat;
var long;
var userprice;
var userpricerange;

//function definitions


//get the location
function getLocation() {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    alert("Geolocation is not supported by this browser.");
  }
}

//store current location in variables
function showPosition(position) {
  lat = position.coords.latitude.toString();
  long = position.coords.longitude.toString();
}


//create cuisine buttons
function renderbuttons() {
  culturepick = "";
  cultures = "";
  $("#BtnDisplay").empty();
  CuisinesButtonsFinished = [];
  for (var i = 0; i < cuisines.length; i++) {
    var btns = $("<button>");
    var values = cuisines[i];
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
    $(this).attr("class", "btn btn-primary cuisineButton active" )
  } else {
    $(this).attr("checker", "unchecked");
    $(this).attr("class", "btn btn-primary cuisineButton")
  }
}




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

    prevculture = snapshot.val().culture;
    previouscultures = snapshot.val().previous;
    previousprice = snapshot.val().price;
    // console.log(prevculture);
    // console.log(previouscultures);

    //renders a previous search button if previous terms exist for user
    if (prevculture != ""){
      $("#prevresults").empty();
      var previousbutton = $("<button id=prevbutton>");
      previousbutton.addClass("btn btn-primary prevbutton");
      previousbutton.text("See Your Previous Results for " + previouscultures + " for $" + previousprice);
      $("#prevresults").append(previousbutton);

    }
  });
});
};




function previousbuttonfunction(){
  userprice = 0;
  culturepick = prevculture;
  userprice = previousprice;
  restuarantsapi();
  recipesapi();
  renderbuttons();
}


//loop through buttons for "checked" function. If there, add value to culture(s) picked
function GetCuisinePrefs() {
  for (var j = 0; j < CuisinesButtonsFinished.length; j++) {
    var newchecker = CuisinesButtonsFinished[j].attr("checker");
    if (newchecker === "checked") {
      cultures += CuisinesButtonsFinished[j].val().trim() + ", ";
      culturepick += CuisinesButtonsFinished[j].val().trim().toLowerCase() + "&";
    };
  };
};

//restaurant API call
function restuarantsapi(){
  finalQueryURL = queryBaseURL + "search?q=" + culturepick + "lat=" + lat + "&lon=" + long + "&count=5";
  // console.log(finalQueryURL);
  $.ajax({
    url: finalQueryURL,
    method: "GET",
    headers:
    {
      "user-key": "b585192e1aca10c32e449a9b7c13f1cd"
    }
  })

  .done(function(response) {
    $("#restaurants").empty();
  // console.log(response.restaurants);
   var restresults = response.restaurants;
   console.log(restresults);
   for (var i = 0; i < restresults.length; i++) {
    var restcontainer = $("<div class = 'countries'>");
    var restName = restresults[i].restaurant.name;
    var restlink = restresults[i].restaurant.url;
    var restWeb = "<a class='links' href ='" + restlink + "' target='_blank'>" + restName +"</a>"
    var restLoca = restresults[i].restaurant.location.address;
    // var image ="<img src='" + response.restaurants[i].restaurant.photos_url + "''></img>"
    var cost = restresults[i].restaurant.average_cost_for_two;
    var priceRange = restresults[i].restaurant.price_range;

    priceranges();
    console.log("Userprice range" + userpricerange);
    function pricechecker(){
      if (userpricerange < restresults[i].restaurant.price_range){
        return false;
      }
    }
    pricechecker();
    restcontainer.prepend(restWeb);
    restcontainer.append("<p>")
    restcontainer.append(restLoca);
    restcontainer.append(cost);
    if (pricechecker() !=false){
    $("#restaurants").append(restcontainer);
    }
    }
    if (restresults == []){
      $("#restaurants").append("<h1> Oh No! Looks like there are no viable restaurants near you! Try again or pick a recipe! <h1>")
    }
  });
}



//recipe API call
function recipesapi(){
  finalQueryURL2= queryBaseURL2 + "?q=" + culturepick +"&count=10";
  // console.log(finalQueryURL2);
  $.ajax({
    url: finalQueryURL2,
    method:"GET",
  })


  .done(function(response) {
    $("#recipes").empty();

    var recipes = JSON.parse(response)
    // console.log(recipes);

    var recipeArr = recipes.results;
    // console.log(recipeArr);

    for (var i = 0; i < recipeArr.length; i++) {


        var recipecontainer= $("<div class='reciperesponse'>")
        var recipetitle = recipeArr[i].title;
        var recipelink = "<a class = 'links' href= '" + recipeArr[i].href +"'target='_blank'>" + recipeArr[i].title +"</a>"
        var recipethumb = recipeArr[i].thumbnail;
        // console.log(recipetitle, recipelink, recipethumb);
        recipecontainer.append(recipetitle);
        recipecontainer.append(recipelink);
        recipecontainer.prepend(recipethumb);
        var recipethumb = "<a href="+String(recipeArr[i].thumbnail);
         var recipeingredient= recipeArr[i].ingredients;
         // recipeArr[i].thumbnail;
         // "<img src = thumbnail=''"+
         console.log(recipetitle, recipelink, recipethumb, recipeingredient);
         recipecontainer.append(recipetitle);
         recipecontainer.append(recipelink);
         recipecontainer.append(recipeingredient);
         recipecontainer.prepend(recipethumb);

         $("#recipes").append("<div class='reciperesponse'><p>"+ recipethumb + "</p><p>"+ recipelink + "</p><p>"+"Ingredients:"+ recipeingredient + "</p><p>");

      }

});
}

function validate(){

   userprice = $("#inlineFormInputGroup").val().trim();
    if ((isNaN(userprice)) || (userprice =="")){
      $("#submit").attr("data-target", "#invalid");

      return false;

    }  else {
      $("#submit").attr("data-target", "#success");
      return true;
    }
  }

function priceranges (){
    if (userprice <=25){
      userpricerange = 1;

    } else if (userprice <= 50){
      userpricerange = 2;

    } else if (userprice <=75){
      userpricerange = 3;

    } else if (userprice >= 76){
      userpricerange = 4;
    }

}


//call independent functions
getLocation();
renderbuttons();
previous();


//clickhandlers
//click handler for all cuisine buttons to run the check function
$(document).on("click", ".cuisineButton", checkFunction);

//click handler for using the previous search terms entered
$(document).on("click", ".prevbutton", previousbuttonfunction);




//submit button for new search
$("#submit").on("click", function() {

  event.preventDefault();
  if (validate() == true){
  userprefs.culture = usertemp.culture;
  userprefs.previous = usertemp.previous;
  userprefs.price = usertemp.price;
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref('Users/' + user.displayName).set(userprefs);
    });
  GetCuisinePrefs();
  usertemp.culture = culturepick;
  usertemp.previous = cultures;
  usertemp.price = userprice;
  restuarantsapi();
  recipesapi();
  renderbuttons();
  console.log(usertemp);
  }
})


//should the user click refresh without doing another search, the temp userobject is pushed to firebase to become the "previous search"
$(window).on("unload", function (){
  if (userprefs.culture != ""){
  userprefs.culture = usertemp.culture;
  userprefs.previous = usertemp.previous;
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref('Users/' + user.displayName).set(userprefs);
    });
  };
})

// });

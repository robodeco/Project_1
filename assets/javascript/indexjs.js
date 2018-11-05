//title animation
var basicTimeline = anime.timeline();
basicTimeline.add({
    targets: '#F',
    scale: 1.5,
    duration: 300,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#E',
    scale: 1.5,
    duration: 300,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#E2',
    scale: 1.5,
    duration: 300,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#D',
    scale: 1.5,
    duration: 300,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#B',
    scale: 1.5,
    duration: 300,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#A',
    scale: 1.5,
    duration: 300,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#G',
    scale: 1.5,
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
var cultures = "";
prevculture = "";
var usertemp = {
  culture: "",
  price: "",
  previous: ""
}

var cuisines = ["American", "Italian", "Mexican", "Chinese", "Thai", "Afghan", "African", "Brazilian", "Caribbean", "European", "Ethiopian", "Filipino", "Indonesian", "Japanese", "Lebanese", "Mediterranean", "Moroccan", "Peruvian", "Portuguese", "Russian", "Vietnamese", "Vegetarian", "Nepali"]
var CuisinesButtonsFinished = [];
var finalQueryURL;
var queryBaseURL = "https://developers.zomato.com/api/v2.1/";
var finalQueryURL2;
var cuisineVal2 = "";
var lat;
var long;
var userprice;
var userpricerange;
var queryBaseURL2 = "http://food2fork.com/api/search?key=";
var f2fkey= "2ae002a5e80f4bbc77f1c9a0da4876dc";

//function definitions


//get the location
function getLocation() {
  if (navigator.geolocation) {
    //get location through browser (asks user with a prompt)
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //if browser doesn't support location services
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
  //resets culturepick after a search
  culturepick = "";
  //resets values for showing in the previous search button
  cultures = "";
  //empties the buttons so user doesn't already have buttons clicked from last search
  $("#BtnDisplay").empty();
  //empties the completeled buttons array
  CuisinesButtonsFinished = [];
  //loops through the cuisines array
  for (var i = 0; i < cuisines.length; i++) {
    //creates a button
    var btns = $("<button>");
    //sets the values of the button
    var values = cuisines[i];
    //sets the button's class
    btns.addClass("btn btn-primary cuisineButton");
    //adds a checker attribute
    btns.attr("checker", "unchecked");
    //applies the button value to the button
    btns.attr("value", values);
    //labels the button for the DOM
    btns.text(cuisines[i]);
    //appends all buttons to the display in the DOM
    $("#BtnDisplay").append(btns);
    //pushes completed buttons to a completed array that can be looped through
    CuisinesButtonsFinished.push(btns);

  };
};


//if cuisine button is clicked, give it a attr of "checked". If it is unclicked,change to "unclicked"
function checkFunction() {
  //sets ischecked to attr of the button that was clicked of "checker"
  var ischecked = $(this).attr("checker");
  //if checker is not checked
  if (ischecked === "unchecked") {
    //change attr to checked
    $(this).attr("checker", "checked");
    //change class to active to show on the DOM it has been clicked
    $(this).attr("class", "btn btn-primary cuisineButton active")
    //if checker is checked
  } else {
    //change attr to unchecked
    $(this).attr("checker", "unchecked");
    //remove the active class so the button appears unclicked
    $(this).attr("class", "btn btn-primary cuisineButton")
  }
}




//previous terms and users function
function previous() {
  firebase.auth().onAuthStateChanged(function(user) {
    //if user is logged in
    if (user) {
      //grab the display name of the current logged in user
      var displayName = user.displayName;
      //show the user name on the DOM
      $("#usernamedisplay").append("Welcome " + displayName);
      //create an anchor element for a signout button
      var signOutbutton = $("<a>");
      //add classes to the signout button to define it as a button
      signOutbutton.addClass("btn btn-primary signbutton");
      //give the signout button the correct href for our signin page
      signOutbutton.attr("href", "signin.html");
      //add text to teh btn for the DOM
      signOutbutton.text("Not you? Sign Out");
      //give the signout button an ID
      signOutbutton.attr("id", "signout");
      //append signout button to the DOM
      $("#signinorout").append(signOutbutton);
      //on click even for the signout button
      $("#signout").on("click", function() {
        //signout and redirect to signin page
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
      });
      //if user is not logged in
    } else {
      //create an anchor element for a signin button
      var signInbutton = $("<a>");
      //add classes to signin button to define it as a button
      signInbutton.addClass("btn btn-primary signbutton");
      //give the signin button href to our sigin page
      signInbutton.attr("href", "signin.html");
      //add text to sigin button
      signInbutton.text("You are not signed in! Click here!")
      //append signin button to DOM
      $("#signinorout").append(signInbutton);
    }

    //pull previous search terms for signed in user
    firebase.database().ref('Users/' + user.displayName).on("value", function(snapshot) {

      prevculture = snapshot.val().culture;
      previouscultures = snapshot.val().previous;
      previousprice = snapshot.val().price;


      //renders a previous search button if previous terms exist for user
      if (prevculture != "") {
        //empties the div with the previous button
        $("#prevresults").empty();
        //creates a button with an id
        var previousbutton = $("<button id=prevbutton>");
        //adds class to define the button
        previousbutton.addClass("btn btn-primary previousbutton");
        //shows the previous search terms as text in the button
        previousbutton.text("See Your Previous Results for " + previouscultures + " for $" + previousprice);
        //appends the button to the DOM
        $("#prevresults").append(previousbutton);

      }
    });
  });
};


//defines what happens when previous search button is clicked
function previousbuttonfunction() {
  //sets userprice to 0
  userprice = 0;
  //sets culturepick to previous cultures picked
  culturepick = prevculture;
  //sets userprice to the previous price
  userprice = previousprice;
  //calls all api's using above previous values
  restuarantsapi();
  recipesapi();
  //calls the buttons to reset
  renderbuttons();
}


//loop through buttons for "checked" function. If there, add value to culture(s) picked
function GetCuisinePrefs() {
  for (var j = 0; j < CuisinesButtonsFinished.length; j++) {
    //defines checked or unchecked within the button attrs as a variable
    var newchecker = CuisinesButtonsFinished[j].attr("checker");
    //if attr is checked
    if (newchecker === "checked") {
      //add the value to cultures and culturepick. Cultures shows in previous terms with the &, culturepick is operational for the APIs
      cultures += CuisinesButtonsFinished[j].val().trim() + ", ";
      culturepick += CuisinesButtonsFinished[j].val().trim().toLowerCase() + "&";
    };
  };
};

//restaurant API call
function restuarantsapi() {

  finalQueryURL = queryBaseURL + "search?q=" + culturepick + "lat=" + lat + "&lon=" + long + "&count=5";
  //ajax call
  $.ajax({
      url: finalQueryURL,
      method: "GET",
      headers: {
        "user-key": "b585192e1aca10c32e449a9b7c13f1cd"
      }
    })

    .done(function(response) {
      //empty the previous search
      $("#restaurants").empty();
      // store results in a variable
      var restresults = response.restaurants;
      //loop through results
      for (var i = 0; i < restresults.length; i++) {
        //create a DIV to hold all restuarant info
        var restcontainer = $("<div class = 'countries'>");
        //determine name
        var restName = restresults[i].restaurant.name;
        //determine link
        var restlink = restresults[i].restaurant.url;
        //grabs the link and creates an anchor element using the name of the restaurant as the front facing element
        var restWeb = "<a class='links' href ='" + restlink + "' target='_blank'>" + restName + "</a>"
        //grabs the location
        var restLoca = restresults[i].restaurant.location.address;
        //grabs the price range
        var priceRange = restresults[i].restaurant.price_range;
        //runs the priceing function that determins the price range (1-4) of the user's input amount
        priceranges();
        //function to check if the user's price range is below results
        function pricechecker() {
          //if user price range is less than the range of the restuarant, return false
          if (userpricerange < restresults[i].restaurant.price_range) {
            return false;
          }
        }
        //call the pricechecker function
        pricechecker();
        //prepend the link created above
        restcontainer.prepend(restWeb);
        //append an empty paragraph for space
        restcontainer.append("<p>");
        //append the location
        restcontainer.append(restLoca);
        //check if pricecheker returned false
        if (pricechecker() != false) {
          //if pricechecker did not return false, restauran is within price range and is shown
          $("#restaurants").append(restcontainer);
        }
        //end the for loop
      }
      //if no results returned, append message
      if (restresults == []) {
        $("#restaurants").append("Oh No! Looks like there are no viable restaurants near you! Try again or pick a recipe!")
      }
      //end response function
    });
}



//recipe API call
function recipesapi() {
  console.log(culturepick);
  finalQueryURL2 = queryBaseURL2 + f2fkey + "&q=" + culturepick;

  console.log(finalQueryURL2);
  $.ajax({
      url: finalQueryURL2,
      method: "GET"
    })
    .done(function(response) {

      $("#recipes").empty();
      var result = JSON.parse(response)
      console.log(result)
      var recipeArr = result.recipes;

      for (var i = 0; i < recipeArr.length; i++) {
        var recipecontainer = $("<div class='reciperesponse'>")

        var reciperes = {
          title: recipeArr[i].title,
          link: recipeArr[i].source_url,
          thumb: "<img class=recipeimg src=" + String(recipeArr[i].image_url) + '>',
          ingredients: recipeArr[i].ingredients,
          // favorite: "<img class= 'favicon' src = '../imgs/fvicon.png' height = '30px' width = '30px' fav= 'no' rest='no' >",

        }

        recipecontainer.attr("href", reciperes.link);
        recipecontainer.attr("title", reciperes.title);
        recipecontainer.attr("ingredients", reciperes.ingredients);
        recipecontainer.attr("thumbnail", String(recipeArr[i].image_url));




        recipecontainer.append("<p></p>");
        // recipecontainer.append(reciperes.favorite);
        recipecontainer.append("<a class = 'links' href= '" + reciperes.link + "'target='_blank'>" + reciperes.title + "</a>");
        recipecontainer.append("<p></p>")
        recipecontainer.append(reciperes.ingredients);
        recipecontainer.prepend(reciperes.thumb);
        // recres.push(recipecontainer);

        $("#recipes").append(recipecontainer);

      }
    })
}

//validation of user input
function validate() {
  //set the userprice to the user price input
  userprice = $("#inlineFormInputGroup").val().trim();
  //if user price is not a number, is not filled our, or no cultures are picked
  if ((isNaN(userprice)) || (userprice == "") && (culturepick == "")) {
    //trigger a modal
    $("#submit").attr("data-target", "#invalid3")

    return false;
    //if user price is not a number or filled out incorrectly
  } else if ((isNaN(userprice)) || (userprice == "")) {
    //trigger a modal
    $("#submit").attr("data-target", "#invalid");

    return false;
    //if no cultures picked
  } else if (culturepick == "") {
    //trigger a modal
    $("#submit").attr("data-target", "#invalid2")

    return false;
    //if cultures are picked and price is input
  } else {
    //no modals
    $("#submit").attr("data-target", "#success");
    return true;
  }
}

//takes user price input and arbitrarily grades on scale of 1-4 per Restaurant API ratings
function priceranges() {
  //if less than or equal to 25 rating is 1
  if (userprice <= 25) {
    userpricerange = 1;
    //if less than or equal to 50 rating is 2
  } else if (userprice <= 50) {
    userpricerange = 2;
    //if less than or equal to 75 rating is 3
  } else if (userprice <= 75) {
    userpricerange = 3;
    //anything greather than 76 rating is 4
  } else if (userprice >= 76) {
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
$(document).on("click", ".previousbutton", previousbuttonfunction);




//submit button for new search
$("#submit").on("click", function() {

  event.preventDefault();
  //loops through buttons looking for checked attrs and adding to culturepicker
  GetCuisinePrefs();
  //validation
  validate();
  //only run if validate returns true
  if (validate() == true) {
    $("#inlineFormInputGroup").val("");
    //push the terms of the last search to firebase
    userprefs.culture = usertemp.culture;
    userprefs.previous = usertemp.previous;
    userprefs.price = usertemp.price;
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref('Users/' + user.displayName).set(userprefs);
    });
    //store the current search terms in a temp object that will be pushed to firebase on the next click of submit or on reload
    usertemp.culture = culturepick;
    usertemp.previous = cultures;
    usertemp.price = userprice;
    //call API's and render the buttons
    restuarantsapi();
    recipesapi();
    renderbuttons();


  }
})


//should the user click refresh without doing another search, the temp userobject is pushed to firebase to become the "previous search"
$(window).on("unload", function() {
  if (usertemp.culture != "") {
    userprefs.culture = usertemp.culture;
    userprefs.previous = usertemp.previous;
    userprefs.price = usertemp.price;
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref('Users/' + user.displayName).set(userprefs);
    });
  };
})

// });

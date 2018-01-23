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

var culturepick = "";
var userprefs = {
  // timeofday : "",
  culture: "",
  price: ""
}

var cuisines = ["American", "Italian", "Mexican", "Chinese", "Thai", "Afghanistan", "African", "Brazilian", "Caribbean", "European", "Ethiopian", "Filipino", "Indonesian", "Japanese", "Lebanese", "Mediterranean", "Moroccan", "Peruvian", "Portuguese", "Russian", "Vietnamese", "Vegetarian"]
var CuisinesButtonsFinished = [];


//create cuisine buttons
function renderbuttons() {
  culturepick = "";
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

renderbuttons();


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
firebase.auth().onAuthStateChanged(function(user) {
  firebase.database().ref('Users/' + user.displayName).on("value", function(snapshot) {
    console.log(snapshot.val());
    var prevculture = snapshot.val().culture;
    var prevprice = snapshot.val().price;
    // var prevtimeofday = snapshot.val().timeofday;
    console.log(prevculture + "," + prevprice);
  });
});


function GetCuisinePrefs() {
  for (var j = 0; j < CuisinesButtonsFinished.length; j++) {
    var newchecker = CuisinesButtonsFinished[j].attr("checker");
    if (newchecker === "checked") {
      culturepick += CuisinesButtonsFinished[j].val().trim() + "&";
    };
  };
};


$("#submit").on("click", function() {
  event.preventDefault();
  GetCuisinePrefs();
  console.log(culturepick);
  userprefs.culture = culturepick;
  renderbuttons();

  // userprefs.timeofday = $("#time-input").val();
  // userprefs.culture = culturepickpicker();
  userprefs.price = $("#price-input").val();

  firebase.auth().onAuthStateChanged(function(user) {
    firebase.database().ref('Users/' + user.displayName).set(userprefs);
  });
});

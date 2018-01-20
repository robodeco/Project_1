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


var timeofday;
var culture;
var price;




$("#submitbtn").on("click", function({
        debugger
        timeofday = $("#time-input").val();
        culture = $("#culture-input").val();
        price = $("#price-input").val();

        firebase.auth().onAuthStateChanged(function(user) {
          firebase.database().ref('Users/' + user.uid).set({
            timeofday: timeofday,
            culture: culture,
            price: price
          })


        })

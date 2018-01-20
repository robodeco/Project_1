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


var userprefs ={

 timeofday : "",
 culture : "",
 price : ""
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
  } else {
    // No user is signed in.
  }
});



$("#submit").on("click", function(){
  event.preventDefault();

        userprefs.timeofday = $("#time-input").val();
        userprefs.culture = $("#culture-input").val();
        userprefs.price = $("#price-input").val();

        firebase.auth().onAuthStateChanged(function(user) {
          firebase.database().ref('Users/' + user.displayName).set(userprefs);
        });
});

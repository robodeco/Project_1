

//<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
// <script src="https://www.gstatic.com/firebasejs/4.8.2/firebase.js"></script>
//--> add these to html footer



  // Initialize Firebase

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

var user = {
  Firstname: "",
  Lastname: "",
  location:"",
};

$("#placeholdernameandlocationsubmitbutton").on("click", function(){
  event.preventDefault();
  user.Firstname = $("#placeholderuserfirst").val().trim();
  user.Lastname = $("#placeholderuserlast").val().trim();
  user.location = $("#placeholderlocation").val().trim();

  database.ref().push(user);


});

database.ref().on("value", function(snapshot) {
  var ref = snapshot.val();
  var userarray =[];
  userarray.push(ref);
  console.log(ref);
  console.log(userarray.length);


});

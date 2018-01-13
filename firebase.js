

//<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
// <script src="https://www.gstatic.com/firebasejs/4.8.2/firebase.js"></script>
//--> add this to html footer



  // Initialize Firebase
var config = {
  apiKey: "AIzaSyAVnlzqusPgquz8120f7hliP88cxUc5Ee0",
  authDomain: "foodcodingstarsfeedbag.firebaseapp.com",
  databaseURL: "https://foodcodingstarsfeedbag.firebaseio.com",
  projectId: "foodcodingstarsfeedbag",
  storageBucket: "foodcodingstarsfeedbag.appspot.com",
  messagingSenderId: "930228768539"
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
  var ref = snapshot.toJSON();;
  console.log(ref);

});

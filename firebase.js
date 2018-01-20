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
database.ref().child("Users");



// function toarray(snapshot) {
//   var returnArr = [];
//
//   snapshot.forEach(function(childSnapshot) {
//     var item = childSnapshot.val();
//     // item.key = childSnapshot.Firstname;
//     returnArr.push(item);
//   });
//
//   return returnArr;
//   console.log (returnArr);
// };
//
// function createarray(){
//   database.ref("/Users").on("value", function(snapshot) {
//
//     var array = toarray(snapshot);
//
// });
//
// }

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
     signInOptions : [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    }
  ]
});
var uiConfig = {
  callbacks: {
    signInSuccess: function(currentUser, credential, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,

  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};
ui.start('#firebaseui-auth-container', uiConfig);



$("#submitbtn").on("click", function() {
  event.preventDefault();

  var email = $("#email").val().trim();
  var password = $("#password").val().trim();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode);
  alert(errorMessage);
  alert("Welcome new user!");
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;


    

    // ...
  } else {
    // User is signed out.
    // ...
  }
});




//   if (array == undefined){
//     database.ref("/Users").push(user);
//   } else if (array != undefined){
//       for (var i = 0; i < array.length; i++) {
//         console.log(array[i].Firstname);
//         if (array[i].Firstname == newfirstname) {
//           alert("First and last names match");
//         } else {
//       console.log(user);
//       database.ref("/Users").push(user);
//     }
//   }
// };

});








// database.ref("/Users").on("child_added", function (childSnapshot, prevChildKey) {
//   var storedlastname = childSnapshot.val().Lastname;
//   var storedfirstname = childSnapshot.val().Firstname;
//   var storedlocation = childSnapshot.val().location;

// });

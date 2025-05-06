const firebaseConfig = {
    apiKey: "AIzaSyD_wUTusAVyW12mgVW8aSed8u8NWVYAhLc",
    authDomain: "moodify-624ad.firebaseapp.com",
    databaseURL: "https://moodify-624ad-default-rtdb.firebaseio.com",
    projectId: "moodify-624ad",
    storageBucket: "moodify-624ad.firebasestorage.app",
    messagingSenderId: "652203166360",
    appId: "1:652203166360:web:a55c32fb281d7479cd1eed",
    measurementId: "G-0K7L0YXEBB"
  };
//initialize firebase
  firebase.initializeApp(firebaseConfig);

  //reference your database
  var  moodifyDB = firebase.database().ref('moodify');
  
  document.getElementById('signup').addEventListener('submit',submitForm);

  function submitForm(e){
    e.preventDefault();

    var name=getElementval('username');
    var email=getElementval('email');
    console.log(name,email);

    saveMesages(name,email);
  }
 const saveMesages=(name,email) =>{
   var newSignupdetails = moodifyDB.push();

   newSignupdetails.set({
    name : name,
    email : email,
   });
 };
  const getElementval=(id)=>{
    return document.getElementById(id).value;
  };
import {store, storage, storageRef, updateTour} from "./fb_password.js";
window.onload = ()=>{

updateTour('tourList');

  const form = document.forms.tourData;

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    console.log(form.name.value);
    console.log(form.date.value);
    console.log(form.city.value);
    console.log(form.contry.value);
    db.collection("tours").doc().set({
      name: form.name.value,
      date: new Date(form.date.value),
      city: form.city.value,
      country: form.contry.value
    })
    .then(function() {
      console.log("Document successfully written!");
      updateTour();
      form.reset();
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  });


  // authentication
  /**
  * Function called when clicking the Login/Logout button.
  */
  // [START buttoncallback]
  function toggleSignIn() {
    if (!firebase.auth().currentUser) {
      // [START createprovider]
      var provider = new firebase.auth.GoogleAuthProvider();
      // [END createprovider]
      // [START addscopes]
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      // [END addscopes]
      // [START signin]
      firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // [START_EXCLUDE]
        // document.getElementById('quickstart-oauthtoken').textContent = token;
        // [END_EXCLUDE]
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
      // [END signin]
    } else {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    }
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in').disabled = true;
    // [END_EXCLUDE]
  }
  // [END buttoncallback]
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
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
        // [START_EXCLUDE]
        document.getElementById('authentication').style.display = 'none';
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        let btn = document.getElementById('quickstart-sign-in');
        document.getElementById('quickstart-account-details').textContent = 'null';
        document.getElementById('quickstart-oauthtoken').textContent = 'null';
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  }

  initApp();

  // upload file
  const audioFile = document.getElementById('audioFile');

  audioFile.addEventListener('change',(ev)=>{
    let txt = '';
    console.log("value", audioFile.value);
    console.log("type", audioFile.type);
    console.log("required", audioFile.required);
    console.log("dirname", audioFile.dirname);
    if ('files' in audioFile){
      if (audioFile.files.length == 0)
      txt = "Select one or more files";
      else
      // for (let i = 0; i < audioFile.files.length; i++) {
      for (let i = 0; i < 1; i++) {
        txt += "<br><strong>" + (i+1) + ". file</strong><br>";
        let file = audioFile.files[i];
        console.log(file);
        for (let attr in file) {
          if (attr == "webkitRelativePath")
          console.log(file[attr].split('/'));

          console.log(attr, "-", file[attr]);
          txt += ` <span>${attr} -- ${file[attr]}</span>`;
        }
        upload(file);
      }
    }
    let header = document.querySelector('header');
    header.innerHTML += txt;
  });

  function upload(file){
    // Create the file metadata
    var metadata = {
      contentType: file.type
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('music/' + file.webkitRelativePath).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      }
    }, function(error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
        console.log('unauthorized');
        // User doesn't have permission to access the object
        break;
        case 'storage/canceled':
        console.log('canceled');
        // User canceled the upload
        break;
        case 'storage/unknown':
        console.log('unknown');
        // Unknown error occurred, inspect error.serverResponse
        break;
      }
    }, function() {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
      });
    });

  }
}

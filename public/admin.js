import {store, storage, storageRef, updateTour, tourList} from "./fb_password.js";
window.onload = ()=>{

updateTour('tourList', tourList);

  const form = document.forms.tourData;

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    store.collection("tours").doc().set({
      name: form.name.value,
      date: new Date(form.date.value),
      city: form.city.value,
      country: form.contry.value
    })
    .then(function() {
      console.log("Document successfully written!");
      updateTour('tourList', tourList);
      form.reset();
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  });


  // authentication
  /**
  */
  // [START buttoncallback]
  function toggleSignIn() {
    if (!firebase.auth().currentUser) {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      firebase.auth().signInWithPopup(provider)
      .then((result) => {
        var token = result.credential.accessToken;
        var user = result.user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
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
  const download = document.getElementById('download');

  download.style.display = 'none';
  download.addEventListener('click',(ev)=>{
    if ('files' in audioFile){
      if (audioFile.files.length == 0)
        console.log("Select one or more files");
      else
      {
        for (let i = 0; i < audioFile.files.length; i++)
          upload(file);
      }
    }
  });

  // разбиваем оп альбомам
  function findAlbums(files) {
    let albums = [];
    let prevAlbum = "";
    let tracks = [];
    return new Promise((resolve, reject)=>{
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file["webkitRelativePath"] != undefined)
        {
          let paths = file["webkitRelativePath"].split('/');
          if (paths != undefined && paths.length)
          {
            let album = paths[paths.length-2];
            if (album != "" && prevAlbum != album)
            {
              //first album
              if (i == 0 && prevAlbum == ""){
                tracks.push(file);
              }
              else {
                // next album
                let album = {name:prevAlbum, tracks: tracks};
                albums.push(album);
                tracks = [];
                tracks.push(file);
              }
              prevAlbum = album;
            }
            else {
              tracks.push(file);
            }
          }
        }
      }
      resolve(albums);
    });
  }

  function createHtml(albums, showTag) {
    if (!albums || albums.length == 0)
    {
      showTag.innerHTML = "Select one or more files";
      return;
    }
    // let html = '';
    for (let i = 0; i < albums.length; i++) {
      let html = '';
      let albumName = albums[i].name;
      let tracks = albums[i].tracks;
      let cover;
      for (let i = 0; i < tracks.length; i++) {
        let file = tracks[i];
        if (file.type == 'image/jpeg'){
          cover = new Promise((resolve, reject)=>{
            let reader = new FileReader();
            reader.onload = function(e) {
              resolve(`<img src=${e.target.result} style="width:100%;">`);
            }
            reader.readAsDataURL(file);
          });
        }
        else
        {
          let date = new Date(file.lastModifiedDate);
          date = date.toLocaleDateString('en-US',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
          html += '<div class="downloadTrack">';
          html += `<h3><strong>${i+1} . track  -- </strong>${file["name"]}</h3>`;
          html += `<span>Last Modifide -- ${date}</span>`;
          html += `<span>Relative Path -- ${file["webkitRelativePath"]}</span>`;
          html += `<span>Size -- ${file["size"]}</span>`;
          html += `<span>Type -- ${file["type"]}</span>`;
          html += '</div>';
        }
      }
      let image = '';
      if (cover){
        cover.then((image) => {
          showTag.innerHTML += `<h2>Album: ${albumName}</h2><div class="downloadAlbum">${image}` + html + `</div>`;
        })
        .catch(err => console.error(err));
      } else {
        showTag.innerHTML += `<h2>Album: ${albumName}</h2><div class="downloadAlbum">${image}` + html + `</div>`;
      }

    }
  };

  let uploadData;

  audioFile.addEventListener('change',(ev)=>{
    if ('files' in audioFile){
      if (audioFile.files.length == 0)
        txt = "Select one or more files";
      else
      {
        findAlbums(audioFile.files)
        .then(albums => {
          console.log(albums);
          let loadFiles = document.getElementById('downloadFiles');
          if (loadFiles)
            createHtml(albums, loadFiles);
          download.style.display = 'block';
          // console.log(JSON.stringify(albums));;
          for (let album of albums) {
            console.log(JSON.stringify(album));
            for (let track of album.tracks) {
              console.log(JSON.stringify(track));
            }
          }
          let jsStr = JSON.stringify(albums,"",5);
          console.log(JSON.parse(jsStr));
          // loadFiles.innerHTML += JSON.stringify(albums);
          // uploadData = {map: JSON.stringify(albums);}
        })
        .catch(err => console.error(err));
      }
    }
  });

  function upload(file){
    // use cloud firestore beta
    // Create the file metadata
    var metadata = {
      contentType: file.type,
      size: file.size,
      fullPath: file.webkitRelativePath,
      name: file.name,
    };
    let album = "";
    if (file["webkitRelativePath"] != undefined)
    {
      let paths = file["webkitRelativePath"].split('/');
      if (paths.length)
        album = paths[paths.length];
      console.log('Album',album);
    }

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child(file.webkitRelativePath).put(file, metadata);

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

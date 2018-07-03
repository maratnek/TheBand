window.onload = ()=>{
  console.log('window load');
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAbRIahEJ62ow1ZXbEIJM0EPMOxqYK3VTE",
    authDomain: "the-band-music.firebaseapp.com",
    databaseURL: "https://the-band-music.firebaseio.com",
    projectId: "the-band-music",
    storageBucket: "the-band-music.appspot.com",
    messagingSenderId: "241471440965"
  };
  const theBandApp = firebase.initializeApp(config);
  const db = theBandApp.firestore();
  const dbSettings = {timestampsInSnapshots: true};
  db.settings(dbSettings);

  db.collection("tours").get().then((querySnapshot) => {
    let tourList = document.getElementById('tabloList');
    console.log(tourList);
    let list = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let data = doc.data();
      list += `<span>${data.name}</span><br>`;
      let date = new Date(data.date.seconds*1000);
      date = date.toLocaleDateString('en-US',{year:'numeric', month: '2-digit', day: '2-digit'})
      .replace(/(\d+)\/(\d+)\/(\d+)/,'$2/$1/$3');
      console.log('Date: ',date);
      list += `<span>${date}</span><br>`;
      list += `<span>${data.city}</span><br>`;
      list += `<span>${data.country}</span><br>`;
      list = `<li>${list}</li>`;
    });
    tourList.innerHTML = list;
  });
};
